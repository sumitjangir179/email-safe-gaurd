# email-safe-gaurd

A simple, fast, and robust email verification library for Node.js.

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need to have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/email-safe-gaurd.git
    cd email-safe-gaurd
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Usage

The primary function for verifying an email is `EmailVerifier.verify()`.

1.  **Import the class:**
    First, import the `EmailVerifier` class from the `email-safe-gaurd` package.

    ```javascript
    import { EmailVerifier } from 'email-safe-gaurd';
    ```

2.  **Call the `verify` method:**
    The `verify` method is an `async` static method on the `EmailVerifier` class. You need to pass the email address you want to check as a string.

    ```javascript
    const emailToCheck = "example@domain.com";
    const result = await EmailVerifier.verify(emailToCheck);
    ```

### Understanding the Result

The `verify` method returns a `Promise` that resolves to an object with the following structure:

-   `isValid` (`boolean`): `true` if the email is valid, otherwise `false`.
-   `reason` (`string`, optional): If `isValid` is `false`, this field will contain the reason for the failure.

Possible failure reasons are:
-   `"INVALID_INPUT"`: The input was not a string or was empty.
-   `"INVALID_SYNTAX"`: The email address does not conform to standard syntax.
-   `"DISPOSABLE_DOMAIN"`: The email domain is from a known disposable email provider.
-   `"NO_MX_RECORDS"`: The domain does not have valid MX (Mail Exchange) records.

### Example

Here is a complete example of how to use the function and handle the result:

```javascript
import { EmailVerifier } from 'email-safe-gaurd';

async function checkEmail(email) {
  const result = await EmailVerifier.verify(email);

  if (result.isValid) {
    console.log(`✅ Email "${email}" is valid.`);
  } else {
    console.log(`❌ Email "${email}" is invalid. Reason: ${result.reason}`);
  }
}

// --- Try it out ---
checkEmail("valid.user@gmail.com");
checkEmail("trash@mailinator.com");
checkEmail("user@non-existent-domain.com");
```

## Development

The project is written in TypeScript and needs to be compiled into JavaScript before it can be run.

### Available Scripts

-   **Build the project:**
    *   This compiles the TypeScript source code into JavaScript in the `dist` folder.
    ```bash
    npm run build
    ```

-   **Run the main script:**
    *   This executes the compiled output. Make sure to run the build command first.
    ```bash
    npm start
    ```

-   **Run tests:**
    *   This will first build the project and then run the test suite.
    ```bash
    npm test
    ```

-   **Watch for changes (Development Mode):**
    *   This will automatically recompile the project whenever you make changes to the source files.
    ```bash
    npm run dev
    ```