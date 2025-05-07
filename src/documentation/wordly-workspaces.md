# Wordly Workspaces Requirements

## Goal

Create a **Workspaces** structural feature that enables admins in larger organizations to manage multiple users and enhance team collaboration through shared access to objects—including minutes, sessions, glossaries, and transcripts. This enhancement will improve service for existing clients while positioning the company for enterprise growth.

## Personas

- Enterprise admin managing a large organization with multiple teams or customers
- A small team that only needs one workspace to manage Wordly resources
- An individual user who just wants Wordly to keep working for them the way it does now
- Wordly tech support

## The Workspace Object

### What is a Workspace?

A Workspace is an organizational container that allows organizations to manage multiple users, resources (sessions, transcripts, glossaries, minutes) and settings (session defaults, custom fields) within a single unified environment. It serves as the primary structure for:

- Managing team members with different permission levels (Admins, Editors, and Viewers)
- Organizing and sharing resources (sessions, transcripts, glossaries, minutes) across teams
- Configuring workspace-specific settings such as custom fields and session defaults

Each workspace can operate independently, allowing organizations to separate different departments, teams, or customer groups while maintaining centralized administration.

### What's in the Workspace Object

- Users belonging to the workspace
- Account that the minutes will draw from
- Glossaries created in or assigned to the workspace
- Sessions created in the workspace
- Transcripts (and transcript artifacts) from sessions created in the workspace
- Custom fields and session defaults configured in the workspace

## Organizations

In order to facilitate the management of Workspaces, we also need to introduce the concept of Organizations, at least on the backend. This will enable us to centralize billing for our larger clients, and enable more enterprise features in the future. We suggest linking accounts (and possibly glossaries) to **Organizations** rather than individual workspaces to allow centralized billing and shared resources.

As an implementation strategy, we will establish an organization structure early to streamline future development. For example, we may want to add a separate system for billing, admin-level views for data aggregation, and organization level user permissions on certain resources, like users and accounts.

We likely will need to designate a "billing admin" or "owner" for each organization, so we have a financially responsible person to send invoices to.

From a migration perspective, we can create a strategy for assigning existing users into an organization by the following existing associations:

- SSO or email domains (eg. @encore.com, @visa.com)
- Shared accounts (eg. Elizabeth @ SBA shares an account with 100 users, so we'll make her the billing admin for the SBA organization)
- HubSpot associated clients that are Active customers
- There may be some smaller organizations that need white glove service to establish their organization, which CS will handle on a case by case basis

## User Stories

### Organization Admins need to be able to

- Manage users and assign permissions to workspaces
- Set another user as an Org Admin
- Create and manage Account permissions to workspaces
  - If a user tries to remove an account from a workspace that has no other account, the account cannot be un-shared. "You need to set another default account before you can remove this one."
- View account usage
- Create and manage Glossary permissions to workspaces

### Admins need to be able to

- Invite new and existing users to the workspaces they admin
  - If invited users are not already Wordly users, the system creates them and sends an invite
  - Invited users do not need to belong to the same domain
- Edit permissions on existing users, including promote to admin, and demote to member
- Remove user from a workspace
- Configure the following settings for a workspace
  - Edit Workspace name
  - Custom fields
  - Session defaults (including default Account)
- Purchase additional minutes (Stripe checkout to add minutes to an account)
- Create workspaces
  - Additionally, offer an import wizard when creating a new workspace to allow the admin to select which accounts, users, glossary, custom fields to use with the new workspace
- Delete workspaces
  - Sessions, Transcripts, Glossaries
  - Retain workspace data for 90 days, then permanently delete
- View Transactions and Activity within the workspace
- Do everything that Editors can do

### Editors need to be able to

- Create/view/launch sessions
- View/download transcripts and transcript artifacts
- View/edit glossaries
- View individual session Activity
- Do everything that Viewers can do

### Viewers need to be able to

- View/launch sessions
- Switch between workspaces

### Wordly Admins need to be able to

- Impersonate a user
- Run reports for all workspaces belonging to a client (eg. Encore)

## Workspace Permissions

Permissions should be designed with room for additional customization of permissions or additional user roles in the future. Backend should have granular user permissions to be future proof.

### Core Permissions Matrix

| Name             | Admin | Editor    | Viewer    |
| ---------------- | ----- | --------- | --------- |
| Sessions         | Edit  | Edit      | View      |
| Purchase minutes | Edit  | No Access | No Access |
| Glossaries       | Edit  | Edit      | View      |
| Transcripts      | Edit  | Edit      | No Access |
| Custom Fields    | Edit  | View      | View      |
| Session Defaults | Edit  | View      | View      |
| Account          | Edit  | View      | View      |
| Users            | Edit  | View      | View      |
| Activity         | View  | View      | View      |
| Transactions     | View  | No Access | No Access |
| Clone Workspace  | Edit  | No Access | No Access |

### Add-on Services Permissions

| Name                             | Admin | Editor    | Viewer    |
| -------------------------------- | ----- | --------- | --------- |
| Transcript translations          | Edit  | Edit      | No Access |
| Audio Transcripts (voice tracks) | Edit  | Edit      | No Access |
| Transcript summaries             | Edit  | Edit      | No Access |
| Prohibiting transcript creation  | Edit  | No Access | No Access |
| Developer API Key                | View  | No Access | No Access |

## Migration Strategy

- All user objects (except Accounts) will be moved into a default workspace called "My Workspace." (Each person will have their own.) This will preserve the legacy user experience and enable users to have a way to keep personal work separate from work within an organization.
  - We may want to use the label "{firstName}'s Workspace" (eg. "Justin's Workspace") to accommodate the use case where a user begins using Wordly as a solo user but then later adds teammates to their workspace and shares it. This will differentiate "Justin's Workspace" from "Graham's Workspace" in the selector.
- Accounts will become owned by the Organization of the user who created them
  - Shared accounts will remain shared to keep the chain unbroken, but now they are shared from across the Organization
- Glossaries will become owned by the My Workspace of the user who created them
  - Shared glossaries will remain shared to keep the chain unbroken, but now they are shared from one My Workspace to the other My Workspace
- Any objects created under a new workspace will belong to that workspace.
- Need to rethink migration as it pertains to organizations

## Deliverables

1. Organization object (association of users, workspaces, accounts, and glossaries)
2. Workspace object (containing accounts, sessions, transcripts, glossaries, session defaults, custom fields, users & roles)
3. Migration of user objects to My Workspace object
   - User profile still has the Full Name, Nickname, Email, Locale, and API Key. Other parts of the profile are moved into the workspace.
4. Admins can create a "clone" workspace (becoming the admin of the new workspace) based on the existing workspace
   - Bring over: Custom fields, Glossary access, Users, Session defaults, Account access
   - Wizard to select which options to import into the new workspace, and whether to share or copy them.
5. Admins can invite new users to workspaces
   - Wordly sends email invites, onboards new users to the workspace
6. Users can do all of the things in the User Stories section above, depending on user role
7. Admins can assign ownership of accounts and glossaries from one workspace to another. In other words, resource ownership can be transferred to another workspace and only one workspace can own a resource at a time.
8. Developer API needs to be updated to work with Workspaces. API permissions follow the same permissions as workspace roles.

## New Users

- If a user is invited to Wordly, they default to invited workspace when they login when accepting an invite.
- If a user joins Wordly on their own, they land in their My Workspace to start with.

## Edge Cases

- If an account is shared with another workspace, and that workspace doesn't have another account, that account cannot be deleted by the original workspace

## Release Criteria

- Existing users have access to all previous data and features
- User Stories from above are satisfied
- Testing in dev environment is completed
- Functionality reviewed and approved by CS, Sales, Partner teams
- Documentation completed, reviewed, and shared with key clients

## Questions

- Perhaps the add-on services can be upsold in the Admin UX?
- If possible, design glossaries for future to be extensible to be able to have layered glossaries
