import type { authClient } from "../../lib/auth-client";

export interface AuthError {
  code: keyof typeof authClient.$ERROR_CODES;
  message: string;
}

export const AuthErrorCodes = {
  ["USER_NOT_FOUND"]: {
    en: "User not found",
    fr: "Utilisateur non trouvé",
    ar: "المستخدم غير موجود",
  },
  ["FAILED_TO_CREATE_USER"]: {
    en: "Failed to create user",
    fr: "Échec de la création de l'utilisateur",
    ar: "فشل في إنشاء المستخدم",
  },
  ["FAILED_TO_CREATE_SESSION"]: {
    en: "Failed to create session",
    fr: "Échec de la création de la session",
    ar: "فشل في إنشاء الجلسة",
  },
  ["FAILED_TO_UPDATE_USER"]: {
    en: "Failed to update user",
    fr: "Échec de la mise à jour de l'utilisateur",
    ar: "فشل في تحديث المستخدم",
  },
  ["FAILED_TO_GET_SESSION"]: {
    en: "Failed to get session",
    fr: "Échec de l'obtention de la session",
    ar: "فشل في الحصول على الجلسة",
  },
  ["INVALID_PASSWORD"]: {
    en: "Invalid password",
    fr: "Mot de passe invalide",
    ar: "كلمة مرور غير صالحة",
  },
  ["INVALID_EMAIL"]: {
    en: "Invalid email address",
    fr: "Adresse e-mail invalide",
    ar: "عنوان البريد الإلكتروني غير صالح",
  },
  ["INVALID_EMAIL_OR_PASSWORD"]: {
    en: "Invalid email or password",
    fr: "E-mail ou mot de passe invalide",
    ar: "البريد الإلكتروني أو كلمة المرور غير صالحة",
  },
  ["SOCIAL_ACCOUNT_ALREADY_LINKED"]: {
    en: "Social account already linked",
    fr: "Compte social déjà lié",
    ar: "الحساب الاجتماعي مرتبط بالفعل",
  },
  ["PROVIDER_NOT_FOUND"]: {
    en: "Provider not found",
    fr: "Fournisseur non trouvé",
    ar: "المزود غير موجود",
  },
  ["INVALID_TOKEN"]: {
    en: "Invalid token",
    fr: "Jeton invalide",
    ar: "رمز غير صالح",
  },
  ["ID_TOKEN_NOT_SUPPORTED"]: {
    en: "ID token not supported",
    fr: "Jeton d'identité non pris en charge",
    ar: "رمز الهوية غير مدعوم",
  },
  ["FAILED_TO_GET_USER_INFO"]: {
    en: "Failed to get user info",
    fr: "Échec de l'obtention des informations de l'utilisateur",
    ar: "فشل في الحصول على معلومات المستخدم",
  },
  ["USER_EMAIL_NOT_FOUND"]: {
    en: "User email not found",
    fr: "E-mail de l'utilisateur non trouvé",
    ar: "البريد الإلكتروني للمستخدم غير موجود",
  },
  ["EMAIL_NOT_VERIFIED"]: {
    en: "Email not verified",
    fr: "E-mail non vérifié",
    ar: "البريد الإلكتروني غير مفعل",
  },
  ["PASSWORD_TOO_SHORT"]: {
    en: "Password too short",
    fr: "Mot de passe trop court",
    ar: "كلمة المرور قصيرة جدا",
  },
  ["PASSWORD_TOO_LONG"]: {
    en: "Password too long",
    fr: "Mot de passe trop long",
    ar: "كلمة المرور طويلة جدا",
  },
  ["USER_ALREADY_EXISTS"]: {
    en: "User already exists",
    fr: "L'utilisateur existe déjà",
    ar: "المستخدم موجود بالفعل",
  },
  ["EMAIL_CAN_NOT_BE_UPDATED"]: {
    en: "Email cannot be updated",
    fr: "L'e-mail ne peut pas être mis à jour",
    ar: "لا يمكن تحديث البريد الإلكتروني",
  },
  ["CREDENTIAL_ACCOUNT_NOT_FOUND"]: {
    en: "Credential account not found",
    fr: "Compte d'identification non trouvé",
    ar: "حساب الاعتماد غير موجود",
  },
  ["SESSION_EXPIRED"]: {
    en: "Session expired",
    fr: "Session expirée",
    ar: "انتهت الجلسة",
  },
  ["FAILED_TO_UNLINK_LAST_ACCOUNT"]: {
    en: "Failed to unlink last account",
    fr: "Échec de la dissociation du dernier compte",
    ar: "فشل في إلغاء ربط الحساب الأخير",
  },
  ["ACCOUNT_NOT_FOUND"]: {
    en: "Account not found",
    fr: "Compte non trouvé",
    ar: "الحساب غير موجود",
  },
};
