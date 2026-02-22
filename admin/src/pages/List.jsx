import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from "../../config";
import { toast } from 'react-toastify';

const List = ({token}) => {

  const [list , setList] = useState([]);
  const [colorTagsList, setColorTagsList] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editColorTags, setEditColorTags] = useState([]);
  const [saving, setSaving] = useState(false);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if(response.data.success === true){
        setList(response.data.products);
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  };

  const fetchColorTags = async () => {
    try {
      const res = await axios.get(backendUrl + '/api/product/color-tags');
      if (res.data.success && res.data.colorTags) setColorTagsList(res.data.colorTags);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchList();
    fetchColorTags();
  }, []);

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove' , {id} ,{headers:{token}})
      if(response.data.success === true){
        toast.success(response.data.message)
        await fetchList();
      }else{
        toast.error (response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  };

  const openEditColorTags = (item) => {
    setEditingProduct(item);
    setEditColorTags(item.colorTags || []);
  };

  const toggleEditColorTag = (tag) => {
    setEditColorTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const saveColorTags = async () => {
    if (!editingProduct) return;
    setSaving(true);
    try {
      const res = await axios.post(
        backendUrl + '/api/product/update',
        { productId: editingProduct._id, colorTags: editColorTags },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success('Color tags updated');
        setEditingProduct(null);
        fetchList();
      } else {
        toast.error(res.data.message || 'Update failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
    setSaving(false);
  };

  return (
    <>
      <p className='mb-2'>All products List</p>
      <div className='flex flex-col gap-2'>
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {list.map((item) => (
          <div className='grid grid-cols-[1fr_3fr_1fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={item._id}>
            <img className='w-12' src={item.image?.[0]} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{currency}{item.price}</p>
            <p className='text-right md:text-center flex items-center justify-end md:justify-center gap-1'>
              <button
                type="button"
                onClick={() => openEditColorTags(item)}
                className='px-2 py-1 text-xs border border-gray-500 hover:bg-gray-100'
              >
                Color tags
              </button>
              <span onClick={() => removeProduct(item._id)} className='cursor-pointer text-lg'>X</span>
            </p>
          </div>
        ))}
      </div>

      {editingProduct && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-10'>
          <div className='bg-white max-w-lg w-full p-6 border border-gray-300'>
            <h3 className='text-lg font-medium mb-2'>Edit color tags – {editingProduct.name}</h3>
            <p className='text-sm text-gray-500 mb-4'>Products with these tags are suggested when room colors complement them.</p>
            <div className='flex flex-wrap gap-2 mb-6'>
              {colorTagsList.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleEditColorTag(tag)}
                  className={`px-3 py-1 text-sm border ${editColorTags.includes(tag) ? 'bg-black text-white border-black' : 'border-gray-400'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className='flex gap-2'>
              <button type="button" onClick={saveColorTags} disabled={saving} className='py-2 px-4 bg-black text-white disabled:opacity-50'>
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button type="button" onClick={() => setEditingProduct(null)} className='py-2 px-4 border border-gray-400'>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default List