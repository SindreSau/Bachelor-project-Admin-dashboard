import FileUploadForm from './file-upload-client';
import UploadedPdfs from './uploaded-pdfs';

const FileUpload = () => {
  return (
    <div className='flex flex-col gap-4'>
      <FileUploadForm />
      <UploadedPdfs />
    </div>
  );
};

export default FileUpload;
