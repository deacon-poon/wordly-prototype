# Transcript Feature Specification

## Project Goal

Enhance the transcript functionality to make existing features more accessible and user-friendly. By improving the UX of transcripts, translations, and summaries, we aim to increase customer adoption of these features, driving higher value and improved renewal rates.

## Core Requirements

### 1. Enhanced Bulk Operations Visibility

**Current Issues**: Multiple duplicate options scattered across the interface with poor discoverability.

**Solution**: Consolidate and make bulk multi-select options more prominent:

- **Unified Download** - Merge current separate "download transcripts" and "download summaries" into single bulk download with format selection
- **Unified Translation** - Combine "translate transcripts" and "translate summaries" into streamlined bulk translation workflow
- **Bulk Summarization** - Generate summaries for multiple transcripts at once
- **Bulk Deletion** - Remove transcripts and all associated translations/summaries

### 2. Unified Language Selection and Translation Workflow

**Current Issues**:

- Duplicate language controls (translate button + language dropdown)
- Workflow where users click Translate → discover language exists → close modal → use language toggle
- Options menu outside main interface causing confusion

**Solution**: Streamlined language interface:

- **Primary language dropdown** - Single source of truth for language selection
- **Smart translation integration** - If translation exists, dropdown switches directly; if not, offers translation option
- **Contextual actions** - Show relevant actions based on current selection and available content
- **Eliminate redundant controls** - Remove separate translate buttons that duplicate dropdown functionality

### 3. Improved Layout and Navigation

#### Layout Options Under Consideration:

**Option A: Enhanced Side Panel** (Current approach, improved)

- Larger resizable panel for better content display
- Summary displayed above transcript in accordion format
- List view maintained for quick navigation between transcripts

**Option B: Full Page Detail View**

- Clicking transcript opens dedicated full-screen view
- Better for editing and detailed content review
- Back navigation to return to list

**Option C: Hybrid Approach**

- Quick preview in side panel for content identification
- "Edit" or "View Details" opens full-screen experience
- Balances quick browsing with detailed interaction

#### Enhanced Context Headers

- Replace generic "Transcript" with specific session information
- Include: Session name, date/time, and timezone
- Provide clear context for transcript origin

#### Summary-Transcript Relationship

- **Default presentation**: Summary displayed above transcript when available
- **Accordion behavior**: Collapsible summary section to focus on transcript when needed
- **Language consistency**: Maintain selected language across summary and transcript views
- **Automatic coupling consideration**: When translating transcript, automatically provide summary in that language

### 4. Enhanced Download and Export Functionality

**Current Issues**:

- Two separate download options (transcripts vs summaries)
- Limited to common language downloads
- No clear visual indicators of available languages

**Solution**:

- **Unified download interface** - Single download action with content type selection (transcript, summary, or both)
- **Multi-language support** - Download all available artifacts in their respective languages
- **Visual language indicators** - Clear display of available languages for each transcript
- **Bulk language processing** - Option to translate missing languages before download

## Technical Architecture Considerations

### Glossary Integration Strategy

**Current State**: Glossaries affect transcript creation and summarization through boost, block, and replace rules, but this relationship is not visible in the interface.

**Future Integration Options**:

1. **Separate but Connected**: Keep glossary management separate but provide clear indicators of glossary impact
2. **Embedded Testing Tool**: Allow glossary rule testing through transcript editing interface
3. **Hybrid Approach**: Quick glossary adjustments in transcript view, full editing in dedicated space

**Implementation Notes**:

- Glossary changes affect transcript generation, not post-processing
- Summary generation applies glossary rules from the English transcript
- Consider transcript editing as pathway to glossary rule creation

### Processing and Cost Optimization

**Current Workflow**:

- Original transcript in source language
- English transcript generation (for non-English sources)
- Summary generation from English transcript
- Translation of summary to target languages
- Optional: Full transcript translation to target languages

**Design Implications**:

- Summary generation is relatively low-cost (short text translation)
- Full transcript translation is high-cost (extensive content)
- Default to summary generation when language translation requested
- Optional full transcript translation as explicit user choice

## Accessibility (WCAG Compliance)

**Critical Priority**: The current transcript UI presents significant accessibility challenges.

**Required Approach**:

- **Semantic Structure**: Use proper heading hierarchy and landmark regions
- **Screen Reader Support**: ARIA labels and descriptions for complex interactions
- **Keyboard Navigation**: Full functionality accessible without mouse
- **Focus Management**: Clear focus indicators and logical tab order
- **Content Relationships**: Clear association between summaries, transcripts, and translations

## User Stories

### As a workspace admin, I want to...

- Select multiple transcripts and perform bulk operations efficiently
- Download transcripts and summaries in multiple languages simultaneously
- Have a single, intuitive interface for language selection and translation
- Understand the relationship between transcripts, summaries, and available languages

### As a user reviewing transcripts, I want to...

- Quickly identify transcript content through summary preview
- Switch between languages without redundant steps
- See clear session context (name, date, time) for each transcript
- Navigate consistently between different content types and languages
- Edit transcripts when necessary with full-screen editing experience

### As an accessibility user, I want to...

- Navigate the transcript interface using only keyboard controls
- Have screen reader support that clearly describes content relationships
- Experience logical content structure with proper headings and sections
- Access all language and download features through assistive technology

## Implementation Priority

### Phase 1: Core UX Improvements

1. **Unified language selection** - Single dropdown replacing duplicate controls
2. **Consolidated bulk operations** - Merge download and translate options
3. **Enhanced session context** - Improved headers with session details
4. **Layout decision implementation** - Choose and implement primary layout approach

### Phase 2: Advanced Features

1. **Enhanced summary-transcript integration** - Accordion layout, automatic coupling
2. **Multi-language download** - Advanced export capabilities
3. **Improved accessibility** - Full WCAG compliance implementation

### Phase 3: Future Extensions

1. **Transcript editing with glossary integration** - Seamless rule creation workflow
2. **Multiple summary formats** - Bullet points, action items, key takeaways
3. **Advanced workflow automation** - Smart translation and summarization workflows

## Success Metrics

- **Increased feature adoption**: Higher usage of transcript translations and summaries
- **Reduced user friction**: Fewer support tickets related to transcript functionality
- **Improved workflow efficiency**: Decreased time to complete common transcript tasks
- **Better accessibility compliance**: Achievement of WCAG AA standards
- **Enhanced user satisfaction**: Positive feedback on simplified language switching and bulk operations

## Technical Specifications

### Data Model Considerations

- **Session-Transcript Relationship**: Multiple transcript instances per session configuration
- **Language Hierarchy**: Original → English (if needed) → Target language translations
- **Artifact Dependencies**: Summary generation depends on English transcript availability
- **Bulk Operation Scope**: Operations apply to selected transcript instances and all associated artifacts

### API Requirements

- **Unified language endpoint**: Single API for language switching and translation requests
- **Bulk operation support**: Efficient handling of multiple transcript operations
- **Status tracking**: Real-time feedback for long-running translation operations
- **Error handling**: Graceful degradation for partial operation failures

## Open Questions for Resolution

1. **Layout Decision**: Which layout approach (side panel, full page, or hybrid) best serves user needs?
2. **Glossary Integration**: Should glossary testing be integrated into transcript editing or remain separate?
3. **Automatic Coupling**: Should translation requests automatically include summary generation?
4. **Cost Balance**: How to balance processing costs with user convenience for automatic operations?
5. **Mobile Experience**: How do chosen layout approaches translate to mobile interfaces?
