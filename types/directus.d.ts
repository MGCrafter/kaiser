export interface WelcomeMessageData {
  id?: number;
  welcome: string;
}

export interface HeaderMessageData {
  id?: number;
  ueberschrift: string;
}
  
  export interface LinkData {
    id?: number;
    url: string;
    title: string;
  }
  export interface impressumData {
    id: number;
    content_blocks: ContentBlocks; // Block Editor Datenfeld mit verschachtelten Blöcken
  }
  export interface bieldergalerieData {
    id: number;
    sort: number
    picture: string;
  }
  
  export interface ContentBlocks {
    blocks: BlockEditorData[]; // Array von BlockEditorData innerhalb von ContentBlocks
  }
  
  export interface BlockEditorData {
    type: string; // Typ des Blocks, z.B. 'text', 'image', 'paragraph'
    data: {
      text?: string; // Textinhalt, wenn der Block vom Typ 'paragraph' ist
      url?: string; // URL des Bildes, wenn der Block vom Typ 'image' ist
      alt?: string; // Alt-Text des Bildes
    };
    id: string; // Eindeutige ID des Blocks
  }