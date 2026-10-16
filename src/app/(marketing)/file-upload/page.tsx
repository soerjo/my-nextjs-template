import FileUpload from '@/components/shadcn-studio/blocks/file-upload-01/file-upload-01';

const FileUploadPage = () => {
  return (
    <div className="py-8 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <FileUpload />
        </div>
      </div>
    </div>
  );
};

export default FileUploadPage;
