// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Sidebar from "../components/Sidebar";
// import { RiDeleteBin6Fill } from "react-icons/ri";

// const Company = () => {
//   const [images, setImages] = useState([]);
//   const [selectedFiles, setSelectedFiles] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);

//   const fetchImages = async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/api/company/all');
//       setImages(res.data);
//     } catch (err) {
//       console.error('Failed to fetch images', err);
//     }
//   };

//   const handleUpload = async () => {
//     const formData = new FormData();
//     for (let file of selectedFiles) {
//       formData.append('images', file);
//     }

//     try {
//       setUploading(true);
//       await axios.post('http://localhost:5000/api/company/upload', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//         onUploadProgress: (progressEvent) => {
//           const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//           setUploadProgress(percent);
//         },
//       });
//       fetchImages();
//       setSelectedFiles(null);
//     } catch (err) {
//       console.error('Upload failed', err);
//     } finally {
//       setUploading(false);
//       setUploadProgress(0);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/company/${id}`);
//       fetchImages();
//     } catch (error) {
//       console.error('Delete failed', error);
//     }
//   };

//   useEffect(() => {
//     fetchImages();
//   }, []);

//   return (
//     <div style={{ display: "flex" }}>
//       <Sidebar />
//       <div style={{ padding: "50px" }}>
//         <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//           <div style={{ marginBottom: '20px' }}>
//             <input
//               type="file"
//               multiple
//               onChange={(e) => setSelectedFiles(e.target.files)}
//               style={{ marginRight: '10px' }}
//             />
//             <button
//               onClick={handleUpload}
//               disabled={uploading || !selectedFiles}
//               style={{
//                 padding: '6px 12px',
//                 backgroundColor: '#1e1e2f',
//                 color: '#fff',
//                 border: 'none',
//                 borderRadius: '4px',
//                 cursor: 'pointer'
//               }}
//             >
//               {uploading ? 'Uploading...' : 'Upload Images'}
//             </button>
//             {uploading && (
//               <div style={{ marginTop: '10px', fontSize: '14px' }}>
//                 Progress: {uploadProgress}%
//               </div>
//             )}

//           </div>

//          <div style={{
//   display: 'grid',
//   gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//   gap: '16px',
//   maxWidth: '1200px',
//   margin: '0 auto'
// }}>
//   {images.map((img) => (
//     <div key={img._id} style={{
//       border: '1px solid #ccc',
//       borderRadius: '4px',
//       padding: '8px',
//       textAlign: 'center',
//       background: '#e2e7e6',
//       transition: 'transform 0.2s ease',
//       cursor: 'pointer'
//     }}
//       onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
//       onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
//     >
//       <img
//         src={img.imageUrl}
//         alt="Company"
//         style={{
//           width: '100%',
//           height: '200px',
//           objectFit: 'cover',
//           borderRadius: '4px'
//         }}
//       />
//       <p style={{ marginTop: '8px', fontWeight: 'bold' }}>{img.name}</p>
//       <button
//         onClick={() => handleDelete(img._id)}
//         style={{
//           marginTop: '8px',
//           backgroundColor: '#1e1e2f',
//           color: 'white',
//           border: 'none',
//           padding: '5px 10px',
//           borderRadius: '4px',
//           cursor: 'pointer'
//         }}
//       >
//         <RiDeleteBin6Fill style={{ fontSize: "20px" }} />
//       </button>
//     </div>
//   ))}
// </div>

//         </div>
//       </div>
      
//     </div>
    
//   );
// };

// export default Company;


//2


import React, { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";
import { RiDeleteBin6Fill } from "react-icons/ri";

const Company = () => {
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [imageNames, setImageNames] = useState([]);
  const [imagePrices, setImagePrices] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(100);

  const fetchImages = async () => {
    try {
      const res = await fetch('https://foodbackend-kadu.onrender.com/api/company/all');
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error('Failed to fetch images', err);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    if (!selectedFiles) return;

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('images', selectedFiles[i]);
      formData.append('names', imageNames[i] || selectedFiles[i].name);
      formData.append('prices', imagePrices[i] || 0);
    }

    try {
      setUploading(true);
      const res = await fetch('https://foodbackend-kadu.onrender.com/api/company/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      await fetchImages();
      setSelectedFiles(null);
      setImageNames([]);
      setImagePrices([]);
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://foodbackend-kadu.onrender.com/api/company/${id}`, { method: 'DELETE' });
      fetchImages();
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  const handleAddOrder = async (img) => {
    const orderData = {
      foodname: img.name,
      price: img.price,
      status: "pending",
    };

    try {
      const res = await fetch("https://foodbackend-kadu.onrender.com/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Order failed");
      alert("Order added successfully!");
    } catch (error) {
      console.error("Error adding order:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ padding: "50px" }}>
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="file"
              multiple
              onChange={(e) => {
                setSelectedFiles(e.target.files);
                setImageNames(Array.from(e.target.files).map(f => f.name));
                setImagePrices(Array.from(e.target.files).map(() => ''));
              }}
              style={{ marginRight: '10px' }}
            />
            <div>
              {selectedFiles &&
                Array.from(selectedFiles).map((file, index) => (
                  <div key={index} style={{ marginBottom: '10px' }}>
                    <input
                      type="text"
                      placeholder="Enter image name"
                      value={imageNames[index] || ''}
                      onChange={(e) => {
                        const newNames = [...imageNames];
                        newNames[index] = e.target.value;
                        setImageNames(newNames);
                      }}
                      style={{ marginRight: '10px', width: '200px' }}
                    />
                    <input
                      type="number"
                      placeholder="Enter price"
                      value={imagePrices[index] || ''}
                      onChange={(e) => {
                        const newPrices = [...imagePrices];
                        newPrices[index] = e.target.value;
                        setImagePrices(newPrices);
                      }}
                      style={{ width: '100px' }}
                    />
                  </div>
                ))}
            </div>
            <button
              onClick={handleUpload}
              disabled={uploading || !selectedFiles}
              style={{
                padding: '6px 12px',
                backgroundColor: '#1e1e2f',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              {uploading ? 'Uploading...' : 'Upload Images'}
            </button>
            {uploading && (
              <div style={{ marginTop: '10px', fontSize: '14px' }}>
                Progress: {uploadProgress}%
              </div>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {images.map((img) => (
              <div key={img._id} style={{
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px',
                textAlign: 'center',
                background: '#e2e7e6',
                transition: 'transform 0.2s ease',
                cursor: 'pointer'
              }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <img
                  src={img.imageUrl}
                  alt="Company"
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }}
                />
                <p style={{ marginTop: '8px', fontWeight: 'bold' }}>{img.name}</p>
                <p style={{ marginTop: '4px' }}>Price: ${img.price}</p>

                <button
                  onClick={() => handleDelete(img._id)}
                  style={{
                    marginTop: '8px',
                    backgroundColor: '#1e1e2f',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '10px'
                  }}
                >
                  <RiDeleteBin6Fill style={{ fontSize: "20px" }} />
                </button>

                <button
                  onClick={() => handleAddOrder(img)}
                  style={{
                    marginTop: '8px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Add Order
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Company;



//3

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Sidebar from "../components/Sidebar";
// import { RiDeleteBin6Fill } from "react-icons/ri";

// const Company = () => {
//   const [images, setImages] = useState([]);
//   const [selectedFiles, setSelectedFiles] = useState(null);
//   const [imageNames, setImageNames] = useState({});
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);

//   const fetchImages = async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/api/company/all');
//       setImages(res.data);
//     } catch (err) {
//       console.error('Failed to fetch images', err);
//     }
//   };

//   const handleUpload = async () => {
//     const formData = new FormData();

//     for (let i = 0; i < selectedFiles.length; i++) {
//       formData.append('images', selectedFiles[i]);
//       formData.append('names', imageNames[i] || selectedFiles[i].name.split('.')[0]);
//     }

//     try {
//       setUploading(true);
//       await axios.post('http://localhost:5000/api/company/upload', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//         onUploadProgress: (progressEvent) => {
//           const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//           setUploadProgress(percent);
//         },
//       });
//       fetchImages();
//       setSelectedFiles(null);
//       setImageNames({});
//     } catch (err) {
//       console.error('Upload failed', err);
//     } finally {
//       setUploading(false);
//       setUploadProgress(0);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/company/${id}`);
//       fetchImages();
//     } catch (error) {
//       console.error('Delete failed', error);
//     }
//   };

//   const handleAddOrder = async (img) => {
//     const orderData = {
//       foodname: img.name,
//       price: 10,
//       status: "pending",
//     };

//     try {
//       await axios.post("http://localhost:5000/api/orders", orderData, {
//         headers: { "Content-Type": "application/json" },
//       });
//       alert("Order added successfully!");
//     } catch (error) {
//       console.error("Error adding order:", error);
//     }
//   };

//   useEffect(() => {
//     fetchImages();
//   }, []);

//   return (
//     <div style={{ display: "flex" }}>
//       <Sidebar />
//       <div style={{ padding: "50px" }}>
//         <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//           <div style={{ marginBottom: '20px' }}>
//             <input
//               type="file"
//               multiple
//               onChange={(e) => {
//                 setSelectedFiles(e.target.files);
//                 const names = {};
//                 Array.from(e.target.files).forEach((file, idx) => {
//                   names[idx] = file.name.split('.')[0]; // default name
//                 });
//                 setImageNames(names);
//               }}
//               style={{ marginRight: '10px' }}
//             />
//             <button
//               onClick={handleUpload}
//               disabled={uploading || !selectedFiles}
//               style={{
//                 padding: '6px 12px',
//                 backgroundColor: '#1e1e2f',
//                 color: '#fff',
//                 border: 'none',
//                 borderRadius: '4px',
//                 cursor: 'pointer'
//               }}
//             >
//               {uploading ? 'Uploading...' : 'Upload Images'}
//             </button>

//             {uploading && (
//               <div style={{ marginTop: '10px', fontSize: '14px' }}>
//                 Progress: {uploadProgress}%
//               </div>
//             )}

//             {/* Name input fields */}
//             {selectedFiles && (
//               <div style={{ marginTop: '10px' }}>
//                 {Array.from(selectedFiles).map((file, idx) => (
//                   <div key={idx} style={{ marginBottom: '10px' }}>
//                     <strong>{file.name}</strong>
//                     <input
//                       type="text"
//                       placeholder="Enter image name"
//                       value={imageNames[idx] || ""}
//                       onChange={(e) =>
//                         setImageNames({ ...imageNames, [idx]: e.target.value })
//                       }
//                       style={{
//                         marginLeft: '10px',
//                         padding: '5px',
//                         width: '200px'
//                       }}
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//             gap: '16px',
//             maxWidth: '1200px',
//             margin: '0 auto'
//           }}>
//             {images.map((img) => (
//               <div key={img._id} style={{
//                 border: '1px solid #ccc',
//                 borderRadius: '4px',
//                 padding: '8px',
//                 textAlign: 'center',
//                 background: '#e2e7e6',
//                 transition: 'transform 0.2s ease',
//                 cursor: 'pointer'
//               }}
//                 onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
//                 onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
//               >
//                 <img
//                   src={img.imageUrl}
//                   alt="Company"
//                   style={{
//                     width: '100%',
//                     height: '200px',
//                     objectFit: 'cover',
//                     borderRadius: '4px'
//                   }}
//                 />
//                 <p style={{ marginTop: '8px', fontWeight: 'bold' }}>{img.name}</p>

//                 <button
//                   onClick={() => handleDelete(img._id)}
//                   style={{
//                     marginTop: '8px',
//                     backgroundColor: '#1e1e2f',
//                     color: 'white',
//                     border: 'none',
//                     padding: '5px 10px',
//                     borderRadius: '4px',
//                     cursor: 'pointer',
//                     marginRight: '10px'
//                   }}
//                 >
//                   <RiDeleteBin6Fill style={{ fontSize: "20px" }} />
//                 </button>

//                 <button
//                   onClick={() => handleAddOrder(img)}
//                   style={{
//                     marginTop: '8px',
//                     backgroundColor: '#28a745',
//                     color: 'white',
//                     border: 'none',
//                     padding: '5px 10px',
//                     borderRadius: '4px',
//                     cursor: 'pointer'
//                   }}
//                 >
//                   Add Order
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Company;
