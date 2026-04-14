import { useEffect, useState } from "react";

function FormularioInscripcion({
  onSubmit,
  inscripcionEditando,
  onCancel,
  estudiantes,
  cursos,
}) {
  const [formData, setFormData] = useState({
    estudianteId: "",
    cursoId: "",
  });

  useEffect(() => {
    if (inscripcionEditando) {
      setFormData({
        estudianteId: inscripcionEditando.estudianteId || "",
        cursoId: inscripcionEditando.cursoId || "",
      });
    } else {
      setFormData({
        estudianteId: "",
        cursoId: "",
      });
    }
  }, [inscripcionEditando]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.estudianteId || !formData.cursoId) {
      alert("Debe completar todos los campos");
      return;
    }

    onSubmit({
      estudiante: { id: Number(formData.estudianteId) },
      curso: { id: Number(formData.cursoId) },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Estudiante</label>
          <select
            name="estudianteId"
            className="form-select"
            value={formData.estudianteId}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            {estudiantes.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Curso</label>
          <select
            name="cursoId"
            className="form-select"
            value={formData.cursoId}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>

            {cursos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.materiaNombre} - Grupo {c.grupo} - {c.docenteNombre}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12">
          <button className="btn btn-primary">
            {inscripcionEditando ? "Actualizar" : "Guardar"}
          </button>

          {inscripcionEditando && (
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={onCancel}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default FormularioInscripcion;