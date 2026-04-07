export const mockFolders = [
  { id: 1, name: "Projects", parentFolderId: 0, createdBy: "user@example.com" },
  { id: 2, name: "Images", parentFolderId: 0, createdBy: "user@example.com" },
  { id: 3, name: "Documents", parentFolderId: 0, createdBy: "user@example.com" },
  { id: 4, name: "Work", parentFolderId: 1, createdBy: "user@example.com" },
];

export const mockFiles = [
  { id: 101, name: "Resume.pdf", type: "pdf", size: "1.2 MB", parentFolderId: 0, createdBy: "user@example.com", imageUrl: "https://via.placeholder.com/150" },
  { id: 102, name: "Profile.jpg", type: "image", size: "2.5 MB", parentFolderId: 0, createdBy: "user@example.com", imageUrl: "https://via.placeholder.com/150" },
  { id: 103, name: "Notes.txt", type: "txt", size: "15 KB", parentFolderId: 3, createdBy: "user@example.com", imageUrl: "https://via.placeholder.com/150" },
];

export const mockUser = {
  name: "John Doe",
  email: "user@example.com",
  image: "https://ui-avatars.com/api/?name=John+Doe",
};
