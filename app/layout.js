import "./globals.css";
import ParentFolderIdContextWrapper from "@/Providers/ParentFolderIdContextWrapper";
import FolderRefreshContextWrapper from "@/Providers/FolderRefreshContextWrapper";
import FileRefreshContextWrapper from "@/Providers/FileRefreshContextWrapper";
import ChildrenProvider from "@/Providers/ChildrenProvider";
import StorageContextWrapper from "@/Providers/StorageContextWrapper";

export const metadata = {
  title: "Cloud Box",
  description: "Cloud Storage Web App",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ParentFolderIdContextWrapper>
          <FolderRefreshContextWrapper>
            <FileRefreshContextWrapper>
              <StorageContextWrapper>
                <ChildrenProvider children={children} />
              </StorageContextWrapper>
            </FileRefreshContextWrapper>
          </FolderRefreshContextWrapper>
        </ParentFolderIdContextWrapper>
      </body>
    </html>
  );
}

