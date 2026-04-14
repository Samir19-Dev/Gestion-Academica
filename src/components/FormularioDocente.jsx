
import { useEffect, useState } from "react";

function FormularioDocente({ onSubmit, docenteEditando, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: "",
    especialidad: "",
  });

  useEffect(() => {
    if (docenteEditando) {
      setFormData({
        nombre: docenteEditando.nombre || "",
        especialidad: docenteEditando.especialidad || "",
      });
    } else {
      setFormData({
        nombre: "",
        especialidad: "",
      });
    }
  }, [docenteEditando]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    if (!formData.especialidad.trim()) {
      alert("La especialidad es obligatoria");
      return;
    }

    onSubmit({
      nombre: formData.nombre.trim(),
      especialidad: formData.especialidad.trim(),
    });

    if (!docenteEditando) {
      setFormData({
        nombre: "",
        especialidad: "",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: "",
      especialidad: "",
    });

    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">

        <div className="col-md-6">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            name="nombre"
            className="form-control"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre del docente"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Especialidad</label>
          <input
            type="text"
            name="especialidad"
            className="form-control"
            value={formData.especialidad}
            onChange={handleChange}
            placeholder="Especialidad"
            required
          />
        </div>

        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            {docenteEditando ? "Actualizar" : "Guardar"}
          </button>

          {docenteEditando && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Cancelar
            </button>
          )}
        </div>

      </div>
    </form>
  );
}

export default FormularioDocente;
