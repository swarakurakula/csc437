
export interface StoryPrompt {
    title: string;
    categories: string;
    prompt: string;
    actions: Array<PromptAction>;
    comments: Comments;
  }
  
  export interface PromptAction {
    label: string;
    emoji: string;
  }
  
  export interface Comments {
    icon: string;
    linkText: string;
    linkHref?: string;
  }