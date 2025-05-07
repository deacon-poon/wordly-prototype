# Wordly AI Translation Platform - Knowledge Base Document

## Executive Summary

Wordly is a leading AI-powered translation and interpretation platform that enables real-time, multilingual communication for meetings, events, and content across in-person, virtual, and hybrid settings. This document provides comprehensive information about Wordly's core features, architecture, security practices, and enterprise capabilities to inform the development of the Workspaces feature.

## Company Overview

Founded in 2019, Wordly has rapidly grown to become the market leader in AI-powered translation services, with over 4 million users across more than 1,500 organizations globally as of early 2025. The company is headquartered in Los Altos, California, with a diverse team distributed globally.

The platform serves customers across various sectors including:

- Corporate enterprises
- Educational institutions
- Government agencies
- Non-profit organizations
- Religious institutions
- Event management companies

## Core Technology & Platform Architecture

### AI Translation Engine

Wordly's patented AI translation technology leverages advanced machine learning algorithms to provide real-time translation of spoken content. Key technical aspects include:

- Real-time speech-to-text conversion
- Neural machine translation (NMT) for high-quality translation
- Delivery of translations in meaningful "chunks" for easier consumption
- Support for over 60 languages and 3,000+ language pairs
- Two-way translation capabilities (speakers can present in different languages)
- Multi-speaker language detection for panel discussions

### Platform Infrastructure

Wordly operates as a cloud-based SaaS solution with:

- Distributed cloud architecture using AWS and Google Cloud Platform
- SOC 2 Type II certified security infrastructure
- End-to-end encryption for data in transit and at rest
- Container-based deployment using Kubernetes
- High scalability to support thousands of concurrent users

## Key Features & Capabilities

### Core Translation Features

1. **Multiple Output Formats**

   - Real-time translated audio
   - Live translated captions/subtitles
   - Same-language captioning
   - Translated transcripts

2. **Accessibility Options**

   - Mobile device access via browser (no app required)
   - Desktop/laptop browser access
   - Display options on main screens for in-room viewing
   - Audio or text-based consumption options

3. **Language Support**
   - 60+ languages including major business languages
   - All 24 official EU languages
   - Recent additions include Afrikaans, Albanian, Armenian, Ukrainian, and others

### Enterprise Features

1. **Custom Glossaries**

   - Organization-specific terminology management
   - Product name and brand compliance
   - Industry-specific vocabulary
   - Content moderation capabilities
   - Boost, Block, and Replace functionality

2. **Security & Compliance**

   - SOC 2 Type II certification
   - Data encryption at rest and in transit
   - Single Sign-On (SSO) integration
   - Secure session IDs
   - Protected transcript access
   - Option for local storage of sensitive data
   - No requirement for attendees to create accounts

3. **Administration & Management**

   - Centralized admin portal
   - Account balance monitoring
   - Session creation and management
   - Transcript access controls
   - Custom branding options

4. **Integration Capabilities**
   - Compatible with all major meeting platforms (Zoom, Teams, etc.)
   - Event management platform integrations (Cvent, etc.)
   - Direct audio connections for in-person events
   - Developer APIs for custom platform integration
   - Audio streaming APIs

## Use Cases & Deployment Scenarios

### Deployment Models

1. **In-Person Events**

   - Direct connection to audio mixer/sound system
   - Attendees access via personal devices (phones/tablets)
   - Option for screen display of captions

2. **Virtual Meetings**

   - Integration with videoconferencing platforms
   - Browser-based access for attendees
   - API-based platform integrations

3. **Hybrid Events**

   - Combined in-room and remote attendee support
   - Consistent experience across participation models

4. **On-Demand Content**
   - Video captioning and subtitling
   - Translation of pre-recorded content

### Common Use Cases

- Global conferences and industry events
- Corporate town halls and all-hands meetings
- Sales kickoff events and training sessions
- Government meetings and public forums
- Educational webinars and lectures
- Customer support for global audiences
- Religious services and community events
- Medical conferences and healthcare training

## Pricing & Licensing Model

Wordly operates on a subscription-based model with:

- Packages based on annual translation hours (from 10 to 10,000+)
- Enterprise pricing for large-scale deployments
- Volume discounts (10-30%+)
- Special pricing for non-profits and educational institutions
- Multi-year agreement discounts

All packages include access to the full range of languages and core features, with enterprise tiers adding advanced security, SSO, configurable data storage, and additional features.

## Security & Privacy Framework

Wordly has established the "Trusted AI Translation Framework" that includes:

- SOC 2 Type II certification for security, availability, and privacy
- No use of customer data to train speech recognition or translation models
- Customer ownership and control of all data
- Regular third-party penetration testing
- Static analysis security tooling
- Vulnerability scanning
- Optional security features (SSO, secure sessions, etc.)

## Enterprise Integration Capabilities

### Platform Integrations

Wordly integrates with numerous platforms including:

- Zoom and Microsoft Teams
- Cvent and other event management platforms
- 6Connex, AccelEvents, Bizzabo, Brella, and others
- Custom integrations via API

### Partner Program

Wordly offers a partner program for:

- Event technology companies
- AV and production companies
- Language service providers
- Event management agencies

The program includes API access for direct platform integration, referral fees, and joint go-to-market activities.

## Recent Developments (2024-2025)

- Reached 4 million users milestone (early 2025)
- Added 10 new languages including Ukrainian, Tagalog, and Icelandic
- Released API for easier platform integration
- Enhanced Push-to-Talk translation feature
- Improved custom glossary capabilities

## Relevance to Workspaces Feature Development

### Architecture Parallels

Wordly's platform design offers several parallels to the Workspaces feature being developed:

1. **Multi-tier Organizational Structure**

   - Wordly's enterprise model supports organization-level administration with multiple workspaces/teams
   - Similar to the proposed Organization/Workspace hierarchy

2. **Resource Sharing**

   - Wordly allows sharing of glossaries and accounts across users
   - Comparable to sharing sessions, transcripts, glossaries across workspaces

3. **User Permission Models**

   - Wordly implements role-based permissions (admin, users)
   - Similar to the Admin/Editor/Viewer model proposed for Workspaces

4. **Custom Configuration Per Workspace**
   - Glossary customization at different levels
   - Parallels workspace-specific settings in the proposed feature

### Implementation Considerations

When implementing the Workspaces feature, consider these insights from Wordly's approach:

1. **Enterprise Security First**

   - Build with enterprise-grade security from the beginning
   - Implement SSO and role-based access controls early

2. **Resource Ownership Model**

   - Clear delineation of resource ownership between organization and workspace levels
   - Controls for sharing and transferring resources

3. **Migration Strategy**

   - Wordly's approach to maintaining existing user experiences while introducing new structures
   - Conversion of individual resources to workspace containers

4. **API Strategy**
   - Developer API designed from the beginning to support the organizational structure
   - Permissions aligned with UI-based access controls

## References and Additional Resources

- [Wordly Official Website](https://www.wordly.ai/)
- [Wordly Platform Documentation](https://www.wordly.ai/live-translation)
- [Security Information](https://www.wordly.ai/wordly-security)
- [Partner Program Details](https://www.wordly.ai/partner-program)

---

_This document was compiled in May 2025 for internal project reference._
