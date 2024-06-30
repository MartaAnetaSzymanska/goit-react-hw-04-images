import { useEffect, useState } from "react";
import { Searchbar } from "./SearchBar/SearchBar";
import { ImageGallery } from "./ImageGallery/ImageGallery";
import { Button } from "./Button/Button";
import { Loader } from "./Loader/Loader";
import { Modal } from "./Modal/Modal";
import { getApi } from "./pixabay-api";
import toast, { Toaster } from "react-hot-toast";
import styles from "./App.module.scss";

export const App = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [end, setEnd] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQuery = e.target.query.value;
    if (newQuery !== query) {
      setQuery(newQuery);
    }
  };

  const fetchImages = async (query, page) => {
    try {
      setLoading(true);

      // ---------fetch data from API:--------------

      const fetchedImages = await getApi(query, page);
      const { hits, totalHits } = fetchedImages;
      if (totalHits === 0) {
        toast.error(
          "Sorry, There are no images matching your search query. Please try again.",
        );
        return;
      }
      if (totalHits > 0 && page === 1) {
        toast.success(`Hooray!We found ${totalHits} images`);
      }
      if (page === Math.ceil(totalHits / 12)) {
        setEnd(true);
        toast.error(
          "We're sorry, but you've reached the end of search results.",
        );
      }
      setImages((prev) => [...prev, ...hits]);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // ----------update site with new images----------

  useEffect(() => {
    if (query) {
      fetchImages(query, page);
    }
  }, [query, page]);

  // ----------change page----------

  const handleButtonClick = () => {
    setPage((prev) => ({ page: prev.page + 1 }));
  };

  // ----------handle Modal---------

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal((prev) => ({ openModal: !prev.openModal }));
  };

  return (
    <div className={styles.app}>
      <Searchbar onSubmit={handleSubmit}></Searchbar>
      <ImageGallery
        images={images}
        onImageClick={handleImageClick}></ImageGallery>
      {images.length > 0 && <Button onClick={handleButtonClick}></Button>}
      {loading && <Loader></Loader>}
      {openModal && (
        <Modal image={selectedImage} onClose={handleCloseModal}></Modal>
      )}
      {error && toast.error("Oops, something went wrong! Reload this page!")}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default App;
