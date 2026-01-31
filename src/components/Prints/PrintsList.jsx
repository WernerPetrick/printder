import { useState, useEffect } from "react";
import { getUserPrints, getModelById, deleteSwipe } from "../../services/appwrite";
import { useAuth } from "../../hooks/useAuth";
import "./PrintsList.css";

export default function PrintsList() {
  const { user } = useAuth();
  const [prints, setPrints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModel, setConfirmModel] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    if (!user) return;

    async function loadPrints() {
      try {
        const swipes = await getUserPrints(user.$id);
        const models = await Promise.all(
          swipes.documents.map(async (swipe) => {
            try {
              const model = await getModelById(swipe.modelId);
              return { ...model, _swipeId: swipe.$id };
            } catch {
              return null;
            }
          })
        );
        setPrints(models.filter(Boolean));
      } catch (err) {
        console.error("Failed to load prints:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPrints();
  }, [user]);

  function openConfirm(model) {
    setDeleteError(null);
    setConfirmModel(model);
  }

  async function handleDelete() {
    if (!confirmModel) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteSwipe(confirmModel._swipeId);
      setPrints((prev) => prev.filter((m) => m.$id !== confirmModel.$id));
      setConfirmModel(null);
    } catch (err) {
      console.error("Failed to remove print:", err);
      setDeleteError("Failed to remove. You may need to enable Delete permission on the swipes collection in Appwrite.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return <div className="prints-loading">Loading your prints...</div>;
  }

  if (prints.length === 0) {
    return (
      <div className="prints-empty">
        <h3>No prints yet</h3>
        <p>Mark models as printed from your favourites!</p>
      </div>
    );
  }

  return (
    <>
      <div className="prints-grid">
        {prints.map((model) => (
          <div key={model.$id} className="prints-card">
            <button
              className="prints-card__delete"
              onClick={() => openConfirm(model)}
              aria-label="Remove from prints"
            >
              &times;
            </button>
            <a
              className="prints-card__link"
              href={model.printablesUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="prints-card__image">
                <img src={model.thumbnailUrl} alt={model.title} />
              </div>
              <div className="prints-card__info">
                <h4>{model.title}</h4>
                <p>by {model.author}</p>
              </div>
            </a>
          </div>
        ))}
      </div>

      {confirmModel && (
        <div className="confirm-overlay" onClick={() => !deleting && setConfirmModel(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-modal__title">Remove Print?</h3>
            <p className="confirm-modal__text">
              <strong>{confirmModel.title}</strong> will be removed from your
              prints. This cannot be undone.
            </p>
            {deleteError && (
              <p className="confirm-modal__error">{deleteError}</p>
            )}
            <div className="confirm-modal__actions">
              <button
                className="confirm-modal__btn confirm-modal__btn--cancel"
                onClick={() => setConfirmModel(null)}
                disabled={deleting}
              >
                Keep It
              </button>
              <button
                className="confirm-modal__btn confirm-modal__btn--delete"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
