import { useEffect, useState } from "react";

function FormularioNota({ onSubmit, notaEditando, onCancel, inscripciones }) {
  const [formData, setFormData] = useState({
    inscripcionId: "",
    parcial1: "",
    parcial2: "",
    finalNota: "",
  });

  useEffect(() => {
    if (notaEditando) {
      setFormData({
        inscripcionId: notaEditando.inscripcionId ?? "",
        parcial1: notaEditando.parcial1 ?? "",
        parcial2: notaEditando.parcial2 ?? "",
        finalNota: notaEditando.finalNota ?? "",
      });
    } else {
      setFormData({
        inscripcionId: "",
        parcial1: "",
        parcial2: "",
        finalNota: "",
      });
    }
  }, [notaEditando]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validarNota = (valor, nombreCampo) => {
    if (valor === "" || valor === null || valor === undefined) {
      alert(`El campo ${nombreCampo} es obligatorio`);
      return false;
    }

    const numero = Number(valor);

    if (Number.isNaN(numero)) {
      alert(`El campo ${nombreCampo} debe ser numérico`);
      return false;
    }

    if (numero < 0 || numero > 5) {
      alert(`El campo ${nombreCampo} debe estar entre 0 y 5`);
      return false;
    }

    return true;
  };

  const limpiarFormulario = () => {
    setFormData({
      inscripcionId: "",
      parcial1: "",
      parcial2: "",
      finalNota: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.inscripcionId) {
      alert("Debe seleccionar una inscripción");
      return;
    }

    if (!validarNota(formData.parcial1, "Parcial 1")) return;
    if (!validarNota(formData.parcial2, "Parcial 2")) return;
    if (!validarNota(formData.finalNota, "Final")) return;

    await onSubmit({
      inscripcionId: Number(formData.inscripcionId),
      parcial1: Number(formData.parcial1),
      parcial2: Number(formData.parcial2),
      finalNota: Number(formData.finalNota),
    });

    if (!notaEditando) {
      limpiarFormulario();
    }
  };

  const handleCancel = () => {
    limpiarFormulario();
    if (onCancel) onCancel();
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
                {(i.estudianteNombre || "Sin estudiante")} -{" "}
                {(i.materiaNombre || "Sin materia")} - Grupo{" "}
                {i.grupo || "Sin grupo"}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label">Parcial 1</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="5"
            name="parcial1"
            className="form-control"
            value={formData.parcial1}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-2">
          <label className="form-label">Parcial 2</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="5"
            name="parcial2"
            className="form-control"
            value={formData.parcial2}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-2">
          <label className="form-label">Final</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="5"
            name="finalNota"
            className="form-control"
            value={formData.finalNota}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            {notaEditando ? "Actualizar" : "Guardar"}
          </button>

          {notaEditando && (
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

export default FormularioNota;