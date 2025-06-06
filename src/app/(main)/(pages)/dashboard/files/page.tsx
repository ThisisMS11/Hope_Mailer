"use client";
import FilesPanel from "@/features/files/components/FilesPanel";
const FilesPage = () => {
  return (
    <div className="flex h-full p-6 gap-6">
      {/* Main content - will resize when an email panel opens */}
      <section className="flex flex-col h-full transition-all duration-300 ease-in-out w-full">
        <FilesPanel />
      </section>
    </div>
  );
};

export default FilesPage;
