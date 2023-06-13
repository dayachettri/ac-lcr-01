import { useRef, useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [image, setImage] = useState(null);
  const [layout, setLayout] = useState('column');
  const nameRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage, setImagesPerPage] = useState(2);

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = data.slice(indexOfFirstImage, indexOfLastImage);
  const pageNumbers = Math.ceil(data.length / imagesPerPage);

  const pageArray = Array.from({ length: pageNumbers }, (_, i) => i + 1);

  const renderedPages = pageArray.map(page => (
    <span
      key={page}
      onClick={() => setCurrentPage(page)}
      className={currentPage === page ? 'active' : ''}
    >
      {page}
    </span>
  ));

  useEffect(() => {
    if (currentImages.length === 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentImages, currentPage]);

  const onImageChange = e => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!image || !nameRef.current.value) {
      alert('Fields cannot be empty');
      return;
    }

    const imageUrl = URL.createObjectURL(image);
    const updatedData = [
      ...data,
      {
        id: crypto.randomUUID(),
        name: nameRef.current.value,
        url: imageUrl,
        uploadDate: new Date().toISOString(),
      },
    ];
    setData(updatedData);
    setImage(null);
    nameRef.current.value = '';
  };

  const handleDeleteClick = receivedItem => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      const updatedData = data.filter(item => item.id !== receivedItem.id);
      setData(updatedData);
    }
  };

  let content;
  if (renderedPages.length === 0) {
    content = <h1 className="no-images">No images yet</h1>;
  } else {
    content = currentImages
      .filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(item => (
        <div className="image-container" key={item.id}>
          <img src={item.url} alt={item.name} />
          <div className="action-box">
            <p>{item.name}</p>
            <button onClick={() => handleDeleteClick(item)}>Delete</button>
          </div>
        </div>
      ));
  }

  return (
    <div className="app">
      <h1>Image Gallery</h1>
      <div className="pagination">{renderedPages}</div>
      <input
        placeholder="Search for images by name"
        className="search-input"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <form action="" onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={onImageChange} />
        <input type="text" ref={nameRef} placeholder="Image name" />
        <button type="submit">Submit</button>
      </form>
      <div className="layout-box">
        <h3>Switch layout</h3>
        <button onClick={() => setLayout('column')}>Column</button>
        <button onClick={() => setLayout('grid')}>Grid</button>
      </div>
      <div
        style={
          layout === 'grid' ? { display: 'flex', 'flex-wrap': 'wrap' } : {}
        }
      >
        {content}
      </div>
    </div>
  );
}

export default App;
