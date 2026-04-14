
import { useEffect, useState } from "react";

function FormularioMateria({ onSubmit, materiaEditando, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: "",
    creditos: "",
  });

  useEffect(() => {
    if (materiaEditando) {
      setFormData({
        nombre: materiaEditando.nombre || "",
        creditos: materiaEditando.creditos || "",
      });
    } else {
      setFormData({
        nombre: "",
        creditos: "",
      });
    }
  }, [materiaEditando]);

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

    if (!formData.creditos || Number(formData.creditos) <= 0) {
      alert("Los créditos deben ser mayores a 0");
      return;
    }

    onSubmit({
      nombre: formData.nombre.trim(),
      creditos: Number(formData.creditos),
    });

    if (!materiaEditando) {
      setFormData({
        nombre: "",
        creditos: "",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: "",
      creditos: "",
    });

    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">

        <div className="col-md-8">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            name="nombre"
            className="form-control"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre de la materia"
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Créditos</label>
          <input
            type="number"
            name="creditos"
            className="form-control"
            value={formData.creditos}
            onChange={handleChange}
            placeholder="Créditos"
            required
          />
        </div>

        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            {materiaEditando ? "Actualizar" : "Guardar"}
          </button>

          {materiaEditando && (
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

export default FormularioMateria;

