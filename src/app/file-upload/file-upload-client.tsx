'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { uploadPdf } from '@/actions/blobstorage/file-upload';

interface FormData {
  file: FileList;
}

const FileUploadForm = () => {
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const file = data.file[0];
    const pdf_blob_url = await uploadPdf(file);
    console.log('PDF Blob URL:', pdf_blob_url);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex items-center gap-4'>
      <Input type='file' accept='.pdf' {...register('file')} />
      <Button type='submit'>Upload</Button>
    </form>
  );
};

export default FileUploadForm;
