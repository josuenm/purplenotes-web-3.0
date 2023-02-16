export interface NoteProps {
  _id: string;
  title: string;
  body: string;
  privacy: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateNoteProps {
  title: string;
  body: string;
  privacy: boolean;
}
