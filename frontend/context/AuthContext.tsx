"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  type CognitoUserSession,
  type ICognitoUserPoolData,
} from "amazon-cognito-identity-js";
import { env } from "@/lib/env";
import { api } from "@/lib/api";

/**
 * Customer + admin authentication via Cognito's custom-auth (passwordless
 * OTP) flow. There is no password anywhere in this flow — see
 * backend/src/functions/auth/*.ts for the Lambda triggers that implement
 * OTP generation/verification server-side.
 *
 * Flow:
 *   1. requestOtp(mobileNumber) -> creates the Cognito user if new
 *      (self sign-up) then starts a CUSTOM_AUTH session, which triggers
 *      CreateAuthChallenge to text an OTP via SNS.
 *   2. confirmOtp(code) -> answers the CUSTOM_CHALLENGE; on success Cognito
 *      issues tokens and we store the session.
 *
 * Whether the signed-in user is an ADMIN or CUSTOMER is determined solely
 * by their Cognito ID token's "cognito:groups" claim — the frontend never
 * decides this itself, and no admin routes trust anything else.
 */

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  mobileNumber: string | null;
  idToken: string | null;
  requestOtp: (mobileNumber: string, name?: string) => Promise<void>;
  confirmOtp: (code: string) => Promise<void>;
  logout: () => void;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getUserPool(): CognitoUserPool {
  const poolData: ICognitoUserPoolData = {
    UserPoolId: env.cognitoUserPoolId,
    ClientId: env.cognitoClientId,
  };
  return new CognitoUserPool(poolData);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileNumber, setMobileNumber] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [pendingUser, setPendingUser] = useState<CognitoUser | null>(null);

  const applySession = useCallback(
    (session: CognitoUserSession) => {
      const token = session.getIdToken();
      const payload = token.decodePayload() as Record<string, unknown>;
      const groups = (payload["cognito:groups"] as string[] | undefined) ?? [];

      setIsAuthenticated(true);
      setIsAdmin(groups.includes("ADMINS"));
      setMobileNumber((payload.phone_number as string) ?? null);
      setIdToken(token.getJwtToken());
    },
    []
  );

  useEffect(() => {
    if (!env.cognitoUserPoolId || !env.cognitoClientId) {
      setIsLoading(false);
      return;
    }

    const pool = getUserPool();
    const currentUser = pool.getCurrentUser();

    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    currentUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (!err && session) {
        applySession(session);
      }
      setIsLoading(false);
    });
  }, [applySession]);

  const requestOtp = useCallback(async (mobile: string) => {
    const pool = getUserPool();

    // New customers must exist in the User Pool before CUSTOM_AUTH can be
    // initiated. Self sign-up is attempted first; "UsernameExistsException"
    // just means the customer already has an account, which is fine.
    await new Promise<void>((resolve, reject) => {
      pool.signUp(
        mobile,
        // Cognito requires *some* password value even though it is never
        // used again after this call (all subsequent logins are OTP-only).
        // A random value is generated per sign-up attempt and discarded.
        `Tmp-${crypto.randomUUID()}`,
        [new CognitoUserAttribute({ Name: "phone_number", Value: mobile })],
        [],
        (err) => {
          // "User already exists" is the expected, benign case for any
          // returning user (e.g. the admin logging in again) — we only need
          // the account to exist so CUSTOM_AUTH can start. The SDK surfaces
          // this condition under different property names depending on
          // version, so check all of them.
          const code =
            (err as { name?: string; code?: string; __type?: string } | null)?.name ??
            (err as { code?: string } | null)?.code ??
            (err as { __type?: string } | null)?.__type;

          if (err && code !== "UsernameExistsException") {
            reject(err);
            return;
          }
          resolve();
        }
      );
    });

    await new Promise<void>((resolve, reject) => {
      const user = new CognitoUser({ Username: mobile, Pool: pool });

      user.setAuthenticationFlowType("CUSTOM_AUTH");

      user.initiateAuth(
        new AuthenticationDetails({
          Username: mobile,
        }),
        {
          onSuccess: () => {
            // A returning, already-verified user can in rare cases skip the
            // challenge entirely; treat that as success too.
            resolve();
          },
          onFailure: (err: Error) => reject(err),
          customChallenge: () => {
            setPendingUser(user);
            resolve();
          },
        }
      );
    });
  }, []);

  const confirmOtp = useCallback(
    async (code: string) => {
      if (!pendingUser) {
        throw new Error("No OTP request is in progress. Please request a new code.");
      }

      await new Promise<void>((resolve, reject) => {
        pendingUser.sendCustomChallengeAnswer(code, {
          onSuccess: (session) => {
            applySession(session);
            setPendingUser(null);
            resolve();
          },
          onFailure: (err: Error) => reject(err),
        });
      });
    },
    [pendingUser, applySession]
  );

  const logout = useCallback(() => {
    const pool = getUserPool();
    const currentUser = pool.getCurrentUser();
    currentUser?.signOut();
    setIsAuthenticated(false);
    setIsAdmin(false);
    setMobileNumber(null);
    setIdToken(null);
  }, []);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    const pool = getUserPool();
    const currentUser = pool.getCurrentUser();

    if (!currentUser) return null;

    return new Promise((resolve) => {
      currentUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
        if (err || !session) {
          resolve(null);
          return;
        }
        resolve(session.getIdToken().getJwtToken());
      });
    });
  }, []);

  useEffect(() => {
    api.setTokenGetter(getAccessToken);
  }, [getAccessToken]);

  const value = useMemo<AuthContextType>(
    () => ({
      isAuthenticated,
      isLoading,
      isAdmin,
      mobileNumber,
      idToken,
      requestOtp,
      confirmOtp,
      logout,
      getAccessToken,
    }),
    [isAuthenticated, isLoading, isAdmin, mobileNumber, idToken, requestOtp, confirmOtp, logout, getAccessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}
