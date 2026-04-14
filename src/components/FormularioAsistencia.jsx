import { useEffect, useState } from "react";

function FormularioAsistencia({
  onSubmit,
  asistenciaEditando,
  onCancel,
  inscripciones,
}) {
  const [formData, setFormData] = useState({
    inscripcionId: "",
    fecha: "",
    presente: true,
  });

  useEffect(() => {
    if (asistenciaEditando) {
      setFormData({
        inscripcionId: asistenciaEditando.inscripcionId ?? "",
        fecha: asistenciaEditando.fecha ?? "",
        presente: asistenciaEditando.presente ?? true,
      });
    } else {
      setFormData({
        inscripcionId: "",
        fecha: "",
        presente: true,
      });
    }
  }, [asistenciaEditando]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePresente = (e) => {
    const checked = e.target.checked;

    setFormData((prev) => ({
      ...prev,
      presente: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.inscripcionId) {
      alert("Debe seleccionar una inscripción");
      return;
    }

    if (!formData.fecha) {
      alert("Debe seleccionar una fecha");
      return;
    }

    await onSubmit({
      inscripcion: { id: Number(formData.inscripcionId) },
      fecha: formData.fecha,
      presente: Boolean(formData.presente),
    });

    if (!asistenciaEditando) {
      setFormData({
        inscripcionId: "",
        fecha: "",
        presente: true,
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      inscripcionId: "",
      fecha: "",
      presente: true,
    });

    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Inscripción</label>

          <select
            name="inscripcionId"
            className="form-select"
            value={formData.inscripcionId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una inscripción</option>

            {inscripciones?.map((i) => (
              <option key={i.id} value={i.id}>
                {(i.estudianteNombre || "Sin estudiante")} - {(i.materiaNombre || "Sin materia")} - Grupo {i.grupo || "Sin grupo"}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Fecha</label>

          <input
            type="date"
            name="fecha"
            className="form-control"
            value={formData.fecha}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-2 d-flex align-items-end">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={formData.presente}
              onChange={handlePresente}
            />

            <label className="form-check-label">
              Presente
            </label>
          </div>
        </div>

        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            {asistenciaEditando ? "Actualizar" : "Guardar"}
          </button>

          {asistenciaEditando && (
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

export default FormularioAsistencia;