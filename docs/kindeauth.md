## Set up Kinde Auth yourself

1. Login/Register on Kinde
2. Set up a new project as prompted - choose existing codebase
3. skip installation step - this is already done
4. copy environment variables from Kinde and paste them into .env (not .env.local)
5. Kinde assumes logout_redirect to /dashboard, but this can be set to whatever as unauthorized users are redirected to login no matter what
6. In Kinde:

- In Authentication, only email+code should be selected to use passwordless login with email
- **VERY IMPORTANT**: Go to settings -> Policies and untick "Allow self-sign up" to avoid unauthorized users signing up
- Set up the necessary users

## Adding images for users

- Images are hosted on Gravatar, so make sure to set up a Gravatar account with the same email as the user

## Controlling tokens

- Tokens can be controlled in an application, under tokens
  - Refresh expiry is by default set to 15 days.
