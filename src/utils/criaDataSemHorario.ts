export default function criarDataLocalSemHorario(isoString: string) {
        const d = new Date(isoString);
        const year = d.getUTCFullYear();
        const month = d.getUTCMonth(); // 0-indexed
        const day = d.getUTCDate();

        const localDate = new Date(year, month, day)
        return localDate.toLocaleDateString();
    }