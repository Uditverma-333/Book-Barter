import React, { useState } from 'react';
import InputField from './InputField';
import SelectField from './SelectField';
import { useForm } from 'react-hook-form';
import { useAddBookMutation } from '../../../redux/features/books/booksApi';
import Swal from 'sweetalert2';
import axios from 'axios'; // Required for Cloudinary image upload

const AddBook = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [imageFile, setimageFile] = useState(null);
    const [addBook, { isLoading, isError }] = useAddBookMutation();
    const [imageFileName, setimageFileName] = useState('');
    const [imageUrl, setImageUrl] = useState(''); // To store the uploaded image URL

    const onSubmit = async (data) => {
        const newBookData = {
            ...data,
            coverImage: imageUrl // Include the uploaded image URL here
        };

        try {
            // Add book data with cover image URL
            await addBook(newBookData).unwrap();
            Swal.fire({
                title: "Book added",
                text: "Your book is uploaded successfully!",
                icon: "success",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, It's Okay!"
            });
            reset();
            setimageFileName('');
            setimageFile(null);
            setImageUrl(''); // Reset the image URL
        } catch (error) {
            console.error(error);
            alert("Failed to add book. Please try again.");
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setimageFile(file);
            setimageFileName(file.name);

            // Upload the file to Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'your_upload_preset'); // Replace with your Cloudinary upload preset

            try {
                // Upload image to Cloudinary
                const response = await axios.post(
                    'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', // Replace with your Cloudinary cloud name
                    formData
                );

                // Get the image URL from the Cloudinary response
                const uploadedImageUrl = response.data.secure_url;
                setImageUrl(uploadedImageUrl); // Set the uploaded image URL

                console.log("Image uploaded successfully", uploadedImageUrl);
            } catch (error) {
                console.error("Image upload failed", error);
                alert("Failed to upload image. Please try again.");
            }
        }
    };

    return (
        <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Book</h2>
            <form onSubmit={handleSubmit(onSubmit)} className=''>
                <InputField label="Title" name="title" placeholder="Enter book title" register={register} />
                <InputField label="Description" name="description" placeholder="Enter book description" type="textarea" register={register} />
                <SelectField
                    label="Category"
                    name="category"
                    options={[
                        { value: '', label: 'Choose A Category' },
                        { value: 'business', label: 'Business' },
                        { value: 'technology', label: 'Technology' },
                        { value: 'fiction', label: 'Fiction' },
                        { value: 'horror', label: 'Horror' },
                        { value: 'adventure', label: 'Adventure' },
                    ]}
                    register={register}
                />
                <div className="mb-4">
                    <label className="inline-flex items-center">
                        <input type="checkbox" {...register('trending')} className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500" />
                        <span className="ml-2 text-sm font-semibold text-gray-700">Trending</span>
                    </label>
                </div>
                <InputField label="Old Price" name="oldPrice" type="number" placeholder="Old Price" register={register} />
                <InputField label="New Price" name="newPrice" type="number" placeholder="New Price" register={register} />
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2 w-full" />
                    {imageFileName && <p className="text-sm text-gray-500">Selected: {imageFileName}</p>}
                    {imageUrl && <p className="text-sm text-green-500">Image uploaded successfully!</p>}
                </div>
                <button type="submit" className="w-full py-2 bg-green-500 text-white font-bold rounded-md">
                    {isLoading ? <span>Adding..</span> : <span>Add Book</span>}
                </button>
            </form>
        </div>
    );
};

export default AddBook;
