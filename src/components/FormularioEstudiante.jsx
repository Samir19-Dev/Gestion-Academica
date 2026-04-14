import { useEffect, useState } from "react";

function FormularioEstudiante({
  onSubmit,
  estudianteEditando,
  onCancel,
  carreras,
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    semestre: "",
    carreraId: "",
  });

  useEffect(() => {
    if (estudianteEditando) {
      setFormData({
        nombre: estudianteEditando.nombre ?? "",
        semestre: estudianteEditando.semestre ?? "",
        carreraId: estudianteEditando.carreraId ?? "",
      });
    } else {
      setFormData({
        nombre: "",
        semestre: "",
        carreraId: "",
      });
    }
  }, [estudianteEditando]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    if (!formData.semestre || Number(formData.semestre) < 1 || Number(formData.semestre) > 10) {
      alert("El semestre debe estar entre 1 y 10");
      return;
    }

    if (!formData.carreraId) {
      alert("Debe seleccionar una carrera");
      return;
    }

    await onSubmit({
      nombre: formData.nombre.trim(),
      semestre: Number(formData.semestre),
      carreraId: Number(formData.carreraId),
    });

    if (!estudianteEditando) {
      setFormData({
        nombre: "",
        semestre: "",
        carreraId: "",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: "",
      semestre: "",
      carreraId: "",
    });

    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-5">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            name="nombre"
            className="form-control"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ingrese el nombre del estudiante"
            required
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Semestre</label>
          <input
            type="number"
            name="semestre"
            className="form-control"
            value={formData.semestre}
            onChange={handleChange}
            min="1"
            max="10"
            placeholder="1 - 10"
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Carrera</label>
          <select
            name="carreraId"
            className="form-select"
            value={formData.carreraId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una carrera</option>
            {carreras?.map((carrera) => (
              <option key={carrera.id} value={carrera.id}>
                {carrera.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            {estudianteEditando ? "Actualizar" : "Guardar"}
          </button>

          {estudianteEditando && (
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

export default FormularioEstudiante;