import React, { useEffect, useState } from "react";
import axios from "axios";
import useAxios from "../../../hooks/use-axios";
import { authAxios } from "../../../config/axios-config";
import api from "../../../api";
import toast from "react-hot-toast";

const AddCategoryModal = ({ showModal, setShowModal, categoryId, setCategoryId, onReload }) => {
    
    const {run,isLoading} = useAxios([])
const [categoryData, setCategoryData] = useState({
    nameAr: '',
    nameEn: '',
    bidderDepositFixedAmount: 100,
    sellerDepositFixedAmount: 100,
    subCategories: [
        { 
            id: 0,
            nameAr: '', 
            nameEn: '', 
            customFields: [{ id:0, key: '', resKey: '', type: '', labelAr: '', labelEn: '' }] 
        }
    ]
});
useEffect(() => {
    
    console.log('category Id ',categoryId)
    if (categoryId !== null) {
        run(
            authAxios.get(api.app.category.getCategory(categoryId))
                .then((res) => {
                    const category = res.data.data;
                    console.log('2222', category)
                    setCategoryData({
                        nameAr: category.nameAr || '',
                        nameEn: category.nameEn || '',
                        bidderDepositFixedAmount: Number(category.bidderDepositFixedAmount) || 0,
                        sellerDepositFixedAmount: Number(category.sellerDepositFixedAmount) || 0,
                        subCategories: category.subCategories.map(sub => ({
                            id    : sub.id || 0,
                            nameAr: sub.nameAr || '',
                            nameEn: sub.nameEn || '',
                            customFields: sub.customFields?.map(field => ({
                                id    : field.id || 0,
                                key: field.key || '',
                                resKey: field.resKey || '',
                                type: field.type || '',
                                labelAr: field.labelAr || '',
                                labelEn: field.labelEn || ''
                            })) || []
                        }))
                    });
                })
                .catch((error) => {
                    console.error('Fetch category error:', error);
                })
        );
    }
}, [categoryId]);

  

    const handleCategoryChange = (e) => {
        const { name, value } = e.target;
        setCategoryData({ ...categoryData, [name]: value });
    };

    const handleSubCategoryChange = (index, e) => {
        const { name, value } = e.target;
        const newSubCategories = [...categoryData.subCategories];
        newSubCategories[index][name] = value;
        setCategoryData({ ...categoryData, subCategories: newSubCategories });
    };

    const handleCustomFieldChange = (subIndex, fieldIndex, e) => {
        const { name, value } = e.target;
        const newSubCategories = [...categoryData.subCategories];
        newSubCategories[subIndex].customFields[fieldIndex][name] = value;
        setCategoryData({ ...categoryData, subCategories: newSubCategories });
    };

    const addSubCategory = () => {
        setCategoryData({
            ...categoryData,
            subCategories: [...categoryData.subCategories, { nameAr: '', nameEn: '', customFields: [{ key: '', resKey: '', type: '', labelAr: '', labelEn: '' }] }]
        });
    };

    const addCustomField = (subIndex) => {
        const newSubCategories = [...categoryData.subCategories];
        newSubCategories[subIndex].customFields.push({ key: '', resKey: '', type: '', labelAr: '', labelEn: '' });
        setCategoryData({ ...categoryData, subCategories: newSubCategories });
    };

    const handleSubmit = async () => {
        try {
            const isEditing = categoryId === null ? false : true
            const apiCall = isEditing
                ? authAxios.put(api.app.category.editCategory(categoryId), categoryData) 
                : authAxios.post(api.app.category.createNewCategory, categoryData); 
    
            run(apiCall
                .then((res) => {
                    console.log('11111===>',res)
                    if (res?.data?.success) {
                        setShowModal(false);
                        setCategoryId(null);
                        onReload()
                        toast.success(
                            isEditing 
                                ? "Category updated successfully" 
                                : "New category added successfully"
                        );
                    }
                })
                .catch((error) => {
                    console.error("Category operation error:", error);
                    toast.error("An error occurred. Please try again.");
                })
            );
        } catch (error) {
            console.error("Error submitting category:", error);
        }
    };
    

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 flex items-top  justify-center bg-black bg-opacity-50 z-40">
            <div className="bg-white p-6 mt-5 rounded-2xl shadow-lg w-1/2 z-40 max-h-[630px] overflow-y-auto">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Category</h2>
                
                <input type="text" name="nameAr" placeholder="Category Name (Arabic)" value={categoryData.nameAr} onChange={handleCategoryChange} className="w-full p-2 border rounded-lg mb-2" />
                <input type="text" name="nameEn" placeholder="Category Name (English)" value={categoryData.nameEn} onChange={handleCategoryChange} className="w-full p-2 border rounded-lg mb-2" />
                <input type="number" name="bidderDepositFixedAmount" placeholder="Bidder Deposit Fixed Amount" value={categoryData.bidderDepositFixedAmount} onChange={handleCategoryChange} className="w-full p-2 border rounded-lg mb-2" />
                <input type="number" name="sellerDepositFixedAmount" placeholder="Seller Deposit Fixed Amount" value={categoryData.sellerDepositFixedAmount} onChange={handleCategoryChange} className="w-full p-2 border rounded-lg mb-4" />
                
                <h3 className="text-lg font-medium mt-4 mb-2">Subcategories</h3>
                {categoryData.subCategories.map((subCategory, subIndex) => (
                    <div key={subIndex} className="border p-4 rounded-lg mb-4 border  bg-secondary-light">
                        <input type="text" name="id" hidden value={subCategory.id}  className="w-full p-2 border rounded-lg mb-2" />
                        <input type="text" name="nameAr" placeholder="Subcategory Name (Arabic)" value={subCategory.nameAr} onChange={(e) => handleSubCategoryChange(subIndex, e)} className="w-full p-2 border rounded-lg mb-2" />
                        <input type="text" name="nameEn" placeholder="Subcategory Name (English)" value={subCategory.nameEn} onChange={(e) => handleSubCategoryChange(subIndex, e)} className="w-full p-2 border rounded-lg mb-2" />
                        
                        <h4 className="text-md font-medium mb-2">Custom Fields</h4>
                        {subCategory.customFields.map((field, fieldIndex) => (
                            <div key={fieldIndex} className="p-2 border rounded-lg mb-2">
                                <input type="text" name="id" hidden value={field.id}  className="w-full p-2 border rounded-lg mb-2" />
                                <input type="text" name="key" placeholder="Key" value={field.key} onChange={(e) => handleCustomFieldChange(subIndex, fieldIndex, e)} className="w-full p-2 border rounded-lg mb-1" />
                                <input type="text" name="resKey" placeholder="Res Key" value={field.resKey} onChange={(e) => handleCustomFieldChange(subIndex, fieldIndex, e)} className="w-full p-2 border rounded-lg mb-1" />
                                <input type="text" name="type" placeholder="Type" value={field.type} onChange={(e) => handleCustomFieldChange(subIndex, fieldIndex, e)} className="w-full p-2 border rounded-lg mb-1" />
                                <input type="text" name="labelAr" placeholder="Label (Arabic)" value={field.labelAr} onChange={(e) => handleCustomFieldChange(subIndex, fieldIndex, e)} className="w-full p-2 border rounded-lg mb-1" />
                                <input type="text" name="labelEn" placeholder="Label (English)" value={field.labelEn} onChange={(e) => handleCustomFieldChange(subIndex, fieldIndex, e)} className="w-full p-2 border rounded-lg" />
                            </div>
                        ))}
                        <button onClick={() => addCustomField(subIndex)} className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transition mt-2">Add Custom Field</button>
                    </div>
                ))}
                <button onClick={addSubCategory} className="px-4 py-2 bg-secondary-light text-white rounded-lg hover:bg-green-600 transition mb-4">Add Subcategory</button>
                
                <div className="flex justify-end space-x-3 mt-6">
                    <button onClick={() => {
                        setShowModal(false)
                        setCategoryId(null)
                        }}
                         className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition">Submit</button>
                </div>
            </div>
        </div>
    );
};

export default AddCategoryModal;
