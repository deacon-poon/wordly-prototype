Wordly Platform Feature Documentation for App Prototype Design
Platform Overview
Wordly is a leading AI-powered translation and interpretation platform that enables real-time, multilingual communication for meetings, events, and content across in-person, virtual, and hybrid settings. Founded in 2019, Wordly has rapidly grown to become the market leader in AI-powered translation services, with over 4 million users across more than 1,500 organizations globally as of early 2025.
Core Capabilities
Wordly's patented AI translation technology leverages advanced machine learning algorithms to provide real-time translation of spoken content with capabilities including:

Real-time speech-to-text conversion
Neural machine translation (NMT) for high-quality translation
Delivery of translations in meaningful "chunks" for easier consumption
Support for over 60 languages and 3,000+ language pairs
Two-way translation capabilities (speakers can present in different languages)
Multi-speaker language detection for panel discussions

Feature-to-API Mapping
Based on the API documentation and knowledge base, here's a comprehensive mapping of Wordly's features to their corresponding API endpoints.

1. User Management
   Key Features:

User creation and authentication
User profile management
Role-based permissions

API Endpoints:
POST /rest/users # Create a new user
PUT /rest/users # Update an existing user
GET /rest/users/{wordlyId} # Get user by ID
GET /rest/users/details # Read user details
GET /rest/users/all # Admin: Get all users 2. Account Management
Key Features:

Subscription-based model with packages based on annual translation hours
Enterprise pricing for large-scale deployments
Volume discounts
Special pricing for non-profits and educational institutions
Multi-year agreement discounts

API Endpoints:
GET /rest/accounts # Get accessible accounts
POST /rest/accounts # Create a new account
PUT /rest/accounts/{id} # Update account
DELETE /rest/accounts/{id} # Delete account
POST /rest/accounts/purchase/{id} # Purchase minutes
POST /rest/accounts/transfer-minutes # Transfer minutes between accounts 3. Session/Presentation Management
Key Features:

Create and manage translation sessions
Real-time streaming of translations
Multiple output formats (audio, captions)
Integration with videoconferencing platforms

API Endpoints:
GET /rest/presentations # Get presentations
POST /rest/presentations # Create a presentation
PUT /rest/presentations/{code} # Update a presentation
DELETE /rest/presentations/{code} # Delete a presentation
POST /rest/presentations/start/{code} # Start a presentation
POST /rest/presentations/end/{code} # End a presentation
GET /rest/presentations/active/{code}/{key} # Get active presentation 4. Glossary Management
Key Features:

Organization-specific terminology management
Product name and brand compliance
Industry-specific vocabulary
Content moderation capabilities
Boost, Block, and Replace functionality

API Endpoints:
GET /rest/glossaries # Get accessible glossaries
POST /rest/glossaries # Create a new glossary
PUT /rest/glossaries/{id} # Update glossary
DELETE /rest/glossaries/{id} # Delete glossary 5. Transcript Management
Key Features:

Generation of translated transcripts
Access control for transcripts
Transcript summarization

API Endpoints:
GET /rest/transcripts # Get transcripts
GET /rest/transcripts/{id} # Get transcript by ID
DELETE /rest/transcripts/{id} # Delete transcript
GET /rest/transcripts/content/{id} # Get transcript content
POST /rest/transcripts/{id}/translations/translate # Translate transcript
POST /rest/transcripts/summaries/create # Create summary 6. Resource Sharing and Invitations
Key Features:

Share resources (glossaries, accounts) with other users
Invitation management

API Endpoints:
GET /rest/invitations # Get pending invitations
POST /rest/invitations # Create invitation
PUT /rest/invitations/{id} # Update invitation
DELETE /rest/invitations/{id} # Delete invitation
DELETE /rest/invitations/resource/{type}/{id} # Unshare resource 7. Analytics and Usage
Key Features:

Track usage of translation minutes
View usage summaries and history

API Endpoints:
POST /rest/wordly/analytics/event # Record analytics event
GET /rest/usage-summaries # Get usage summaries
GET /rest/usage-summaries/overview # Get usage overview 8. Security and Compliance
Key Features:

SOC 2 Type II certification
Data encryption at rest and in transit
Single Sign-On (SSO) integration
Secure session IDs
Protected transcript access
Option for local storage of sensitive data
No requirement for attendees to create accounts

API Endpoints:
POST /rest/wordly/user/token # Authentication token
POST /rest/webhooks/iam # Identity and access management
GET /rest/users/{wordlyId}/storage # Get storage metadata 9. Developer API Access
Key Features:

API key management for developers
Integration with other platforms

API Endpoints:
GET /rest/developer/apiKeys # List API keys
POST /rest/developer/apiKeys # Create API key
DELETE /rest/developer/apiKeys/{key} # Delete API key
Workspaces Feature Implementation
The goal of the Workspaces feature is to create a structural feature that enables admins in larger organizations to manage multiple users and enhance team collaboration through shared access to objects—including minutes, sessions, glossaries, and transcripts. This enhancement will improve service for existing clients while positioning the company for enterprise growth.
Workspace Structure
A Workspace is an organizational container that allows organizations to manage multiple users, resources (sessions, transcripts, glossaries, minutes) and settings (session defaults, custom fields) within a single unified environment. It serves as the primary structure for:

Managing team members with different permission levels (Admins, Editors, and Viewers)
Organizing and sharing resources (sessions, transcripts, glossaries, minutes) across teams
Configuring workspace-specific settings such as custom fields and session defaults

Workspace Implementation Considerations

API Endpoints to Extend:

New endpoints will be needed for workspace management
Existing endpoints should be modified to include workspace context

Permissions Model:
The core permissions matrix includes:
NameAdminEditorViewerSessionsEditEditViewPurchase minutesEditNo AccessNo AccessGlossariesEditEditViewTranscriptsEditEditNo AccessCustom FieldsEditViewViewSession DefaultsEditViewViewAccountEditViewViewUsersEditViewViewActivityViewViewViewTransactionsViewNo AccessNo AccessClone WorkspaceEditNo AccessNo Access

Resource Ownership:

All user objects (except Accounts) will be moved into a default workspace called "My Workspace"
Accounts will become owned by the Organization
Glossaries will become owned by the My Workspace of the user who created them
Any objects created under a new workspace will belong to that workspace

Design Recommendations for Prototype App
Based on the API capabilities and the upcoming Workspaces feature, here are recommendations for designing a prototype app:

1. Authentication & User Flow

Implement a login and registration system
Create a workspace selector in the navigation
Support for SSO integration

2. Core Navigation Structure

Dashboard with usage statistics and recent sessions
Sessions/Presentations management
Glossary management
Transcript access and management
Account and billing
User and workspace management (for admins)

3. Presentation Creation and Management

Wizard-based session creation
Language selection interface
Integration with meeting platforms
QR code generation for attendee access

4. Real-time Translation Interface

Captioning display with language selection
Audio playback controls
Transcript viewing and downloading

5. Workspace Management Interface

Create/edit workspaces
User permission management
Resource sharing between workspaces
Activity tracking and logging

6. Migration Considerations
   When implementing the workspace feature, consider:

All user objects (except Accounts) will be moved into a default workspace called "My Workspace"
Accounts will become owned by the Organization
Glossaries will become owned by the My Workspace of the user who created them
Any objects created under a new workspace will belong to that workspace

Technical Implementation Notes

API Interaction:

All API endpoints accept and return JSON
Authentication is handled via tokens
Error handling should accommodate the standard error response format

Real-time Functionality:

Sessions and presentations likely use WebSockets for real-time updates
Audio streaming requires specific handling for low-latency delivery

Security Considerations:

Implement end-to-end encryption
Support SOC 2 Type II compliance requirements
No use of customer data to train speech recognition or translation models
Customer ownership and control of all data
Regular third-party penetration testing
Static analysis security tooling
Vulnerability scanning
