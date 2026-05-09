import { Resolver } from "dns/promises";
import { DISPOSABLE_DOMAINS } from "./domains.js";

const dnsResolver = new Resolver();

export class EmailVerifier {
  /**
   * Validates syntax using a standard RFC-compliant regex.
   * @param {string} email
   * @returns {boolean}
   */
  static isSyntaxValid(email) {
    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return regex.test(email);
  }

  /**
   * Checks if the domain exists in the disposable blocklist.
   * @param {string} domain
   * @returns {boolean}
   */
  static isDisposable(domain) {
    return DISPOSABLE_DOMAINS.has(domain.toLowerCase());
  }

  /**
   * Performs a DNS lookup to verify the domain has MX (Mail Exchange) records.
   * @param {string} domain
   * @returns {Promise<boolean>}
   */
  static async hasMxRecords(domain) {
    try {
      const addresses = await dnsResolver.resolveMx(domain);
      return addresses && addresses.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Main verification method.
   * @param {string} email
   * @returns {Promise<{isValid: boolean, reason?: string}>}
   */
  static async verify(email) {
    if (!email || typeof email !== "string") {
      return { isValid: false, reason: "INVALID_INPUT" };
    }

    const cleanEmail = email.trim().toLowerCase();

    // Layer 1: Syntax
    if (!this.isSyntaxValid(cleanEmail)) {
      return { isValid: false, reason: "INVALID_SYNTAX" };
    }

    const [, domain] = cleanEmail.split("@");

    // Layer 2: Disposable Check
    if (this.isDisposable(domain)) {
      return { isValid: false, reason: "DISPOSABLE_DOMAIN" };
    }

    // Layer 3: DNS Check
    const hasMx = await this.hasMxRecords(domain);
    if (!hasMx) {
      return { isValid: false, reason: "NO_MX_RECORDS" };
    }

    return { isValid: true };
  }
}
