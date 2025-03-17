# Manga Project Creation Workflow

## Current Project Creation Flow

The existing flow has three main steps:
1. **Project Details** - Collecting title, description, and genre
2. **Template Selection** - Choosing a template type and specific template
3. **Preview & Create** - Reviewing details before finalizing

## Enhanced Project Creation & Management Flow

### 1. Initial Project Creation

Keep the current 3-step flow with these enhancements:

```
Project Details → Template Selection → Preview & Create → Project Dashboard
```

- **Project Details**: 
  - Add optional fields like target audience, estimated length, publication schedule
  - Consider adding tags for easier categorization and searching

- **Template Selection**: 
  - Add thumbnail previews with hover states showing template structure
  - Include descriptions of how each template is best used
  - Option to preview the full template before selection

- **Preview & Create**: 
  - Show a visual mockup of how the first few pages might look with the selected template
  - Summarize all project settings before creation
  - Provide quick links to tutorials for getting started

### 2. Project Dashboard (After Creation)

Create a dedicated project dashboard that serves as the command center:

```tsx
// src/app/(main)/studio/projects/[projectId]/page.tsx
// Project dashboard with overview statistics, recent activities, and quick actions
```

The dashboard should include:
- Progress overview (% complete, pages created vs. planned)
- Quick access to recent pages/scenes/characters
- Activity timeline showing recent changes
- Action buttons for common tasks
- Visual representation of project structure
- Team members/collaborators (if applicable)

### 3. Chapter Management

Implement a chapter structure to organize manga content:

```tsx
// src/app/(main)/studio/projects/[projectId]/chapters/page.tsx
// Chapter management interface
```

Features:
- Allow creating, reordering, and managing chapters
- Show completion status for each chapter
- Provide drag-and-drop reordering of chapters
- Set chapter-specific metadata (title, description, notes)
- Chapter cover image selection
- Chapter status tracking (draft, in-progress, review, complete)

### 4. Page Creation & Management

This is where the actual manga creation happens:

```tsx
// src/app/(main)/studio/projects/[projectId]/chapters/[chapterId]/page.tsx
// Page management interface
```

Features:
- Grid view of pages with thumbnails
- Options to add new pages (blank, from template, from AI generator)
- Drag-and-drop reordering of pages
- Page status tracking
- Bulk actions for multiple pages
- Page cloning/duplication options
- Page templates library

### 5. Page Editor

The most critical component - where users edit individual pages:

```tsx
// src/app/(main)/studio/projects/[projectId]/chapters/[chapterId]/[pageId]/page.tsx
// Individual page editor
```

Features:
- Panel layout tools (select from templates or create custom)
- Character placement (drag & drop from project character library)
- Background selection (from project background library)
- Dialog/text addition with speech bubble customization
- Effects and post-processing tools
- Real-time preview mode
- Undo/redo functionality
- Layer management
- Rulers and guides for alignment
- Panel transition effects

### 6. Asset Integration

Connect character and background generators to projects:

```tsx
// Example function for the page editor
const importCharacterToPanel = async (characterId: string, panelId: string) => {
  // Fetch character from database
  // Add character to specific panel
  // Allow position/size adjustments
};
```

Implementation:
- Access to project character library directly in the page editor
- Ability to generate new characters on the fly
- Quick adjustment tools for imported assets
- Character pose library for consistent character appearance
- Background variants for different times of day/weather
- Asset organization system with tagging

### 7. Export & Preview

Add functionality to preview the entire manga or export chapters:

```tsx
// src/app/(main)/studio/projects/[projectId]/preview/page.tsx
// Preview and export functionality
```

Features:
- Page-turning interface to simulate reading experience
- Export to various formats (PDF, CBZ, image sequence)
- Sharing options (direct link, social media, embed)
- Print-ready export with bleed and crop marks
- Web publication option
- Quality settings for different output needs
- Watermark options

## Database Schema Recommendations

Based on your existing structure, here's how the project database schema might look:

```typescript
// Projects table
interface Project {
  id: string;
  title: string;
  description: string;
  user_id: string;
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
  metadata: {
    genre: string;
    template_type: string;
    template_id: string;
    target_audience?: string;
    estimated_pages?: number;
    cover_image?: string;
    progress?: number;
  };
}

// Chapters table
interface Chapter {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  order_index: number;
  status: 'draft' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

// Pages table
interface Page {
  id: string;
  chapter_id: string;
  title?: string;
  order_index: number;
  layout_type: string;
  content: {
    panels: Panel[];
    background_color?: string;
    page_notes?: string;
  };
  created_at: string;
  updated_at: string;
}

// Panels (could be embedded in the Pages record)
interface Panel {
  id: string;
  position: { x: number, y: number, width: number, height: number };
  background_id?: string;
  characters: PanelCharacter[];
  dialog_bubbles: DialogBubble[];
  effects: Effect[];
  z_index: number;
}

// PanelCharacter
interface PanelCharacter {
  id: string;
  character_id: string;
  position: { x: number, y: number };
  scale: number;
  rotation: number;
  flip_x: boolean;
  flip_y: boolean;
  pose: string;
  expression: string;
  z_index: number;
}

// DialogBubble
interface DialogBubble {
  id: string;
  text: string;
  position: { x: number, y: number };
  size: { width: number, height: number };
  bubble_type: 'speech' | 'thought' | 'shout' | 'whisper' | 'narration';
  character_id?: string; // Connected to a speaking character if applicable
  style: {
    font_family: string;
    font_size: number;
    font_weight: string;
    text_align: 'left' | 'center' | 'right';
  };
  tail_position?: { x: number, y: number }; // For speech bubble tails
}
```

## Implementation Approach

Implement this workflow in phases:

1. **Phase 1**: Enhance the current project creation flow and implement the project dashboard
   - Improve project creation UI
   - Build project dashboard with basic metrics
   - Implement project settings and management

2. **Phase 2**: Add chapter and page management
   - Chapter creation and organization
   - Page management interface
   - Basic page templates

3. **Phase 3**: Develop the page editor with basic functionality
   - Panel layout tools
   - Character placement
   - Text and dialog bubbles
   - Save and preview features

4. **Phase 4**: Integrate character and background generators with projects
   - Asset library management
   - AI generation within the editor
   - Asset editing and customization

5. **Phase 5**: Add advanced features
   - Export and publishing options
   - Collaboration tools
   - Version history and backups
   - Advanced effects and transitions

## User Experience Considerations

- **Onboarding**: Provide first-time users with a guided tour of the project creation process
- **Templates**: Offer a range of templates for different manga styles and genres
- **Tutorials**: Embed contextual tutorials throughout the workflow
- **Auto-save**: Implement frequent auto-saving to prevent loss of work
- **Performance**: Optimize for smooth editing experience, even with complex pages
- **Mobile view**: Consider how users might review their projects on mobile devices
- **Feedback**: Collect user feedback throughout the creation process