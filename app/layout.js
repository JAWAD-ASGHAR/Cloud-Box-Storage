import "./globals.css";
import SessionWrapper from "../Providers/SessionWrapper";
import SideNavBar from "../Components/SideNavBar";
import ParentFolderIdContextWrapper from "@/Providers/ParentFolderIdContextWrapper";
import FolderRefreshContextWrapper from "@/Providers/FolderRefreshContextWrapper";
import FileRefreshContextWrapper from "@/Providers/FileRefreshContextWrapper";
import Storage from "@/Components/storage/Storage";
import ChildrenProvider from "@/Providers/ChildrenProvider";

export const metadata = {
  title: "Cloud Box",
  description: "Cloud Storage Web App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          <ParentFolderIdContextWrapper>
            <FolderRefreshContextWrapper>
              <FileRefreshContextWrapper>
                <ChildrenProvider children={children} />
              </FileRefreshContextWrapper>
            </FolderRefreshContextWrapper>
          </ParentFolderIdContextWrapper>
        </SessionWrapper>
      </body>
    </html>
  );
}
