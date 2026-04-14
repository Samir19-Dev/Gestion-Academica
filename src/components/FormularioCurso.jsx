import { useEffect, useState } from "react";

function FormularioCurso({
  onSubmit,
  cursoEditando,
  onCancel,
  docentes,
  materias,
}) {
  const [formData, setFormData] = useState({
    materiaId: "",
    docenteId: "",
    grupo: "",
  });

  useEffect(() => {
    if (cursoEditando) {
      setFormData({
        materiaId: cursoEditando.materiaId || "",
        docenteId: cursoEditando.docenteId || "",
        grupo: cursoEditando.grupo || "",
      });
    } else {
      setFormData({
        materiaId: "",
        docenteId: "",
        grupo: "",
      });
    }
  }, [cursoEditando]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const limpiarFormulario = () => {
    setFormData({
      materiaId: "",
      docenteId: "",
      grupo: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.materiaId) {
      alert("Debe seleccionar una materia");
      return;
    }

    if (!formData.docenteId) {
      alert("Debe seleccionar un docente");
      return;
    }

    if (!formData.grupo.trim()) {
      alert("El grupo es obligatorio");
      return;
    }

    if (formData.grupo.trim().length > 20) {
      alert("El grupo no puede superar 20 caracteres");
      return;
    }

    await onSubmit({
      materiaId: Number(formData.materiaId),
      docenteId: Number(formData.docenteId),
      grupo: formData.grupo.trim(),
    });

    if (!cursoEditando) {
      limpiarFormulario();
    }
  };

  const handleCancel = () => {
    limpiarFormulario();

    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Materia</label>
          <select
            name="materiaId"
            className="form-select"
            value={formData.materiaId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una materia</option>
            {materias?.map((materia) => (
              <option key={materia.id} value={materia.id}>
                {materia.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Docente</label>
          <select
            name="docenteId"
            className="form-select"
            value={formData.docenteId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un docente</option>
            {docentes?.map((docente) => (
              <option key={docente.id} value={docente.id}>
                {docente.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Grupo</label>
          <input
            type="text"
            name="grupo"
            className="form-control"
            value={formData.grupo}
            onChange={handleChange}
            placeholder="Ej: A1"
            maxLength={20}
            required
          />
        </div>

        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            {cursoEditando ? "Actualizar" : "Guardar"}
          </button>

          {cursoEditando && (
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

export default FormularioCurso;