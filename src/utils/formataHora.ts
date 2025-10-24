export default function formataHorarioLocal(horario: Date) {
        const [h, m] = String(horario).slice(11, 16).split(":").map(Number);
        const horarioFormatado = String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0")

        return horarioFormatado;
    }