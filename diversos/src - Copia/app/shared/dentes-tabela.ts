export interface Dente {
	Dente: number;
	De: number;
	Nome: string;
	Dentição: string;
	Lado: string;
	Arcada: string;
}

export const dentesTabela: Dente[] = [
	{ Dente: 51, De: 7.5, Nome: "Incisivo Central", Dentição: "Decíduo", Lado: "Direito", Arcada: "Superior" },
	{ Dente: 52, De: 9, Nome: "Incisivo Lateral", Dentição: "Decíduo", Lado: "Direito", Arcada: "Superior" },
	{ Dente: 53, De: 18, Nome: "Canino", Dentição: "Decíduo", Lado: "Direito", Arcada: "Superior" },
	{ Dente: 54, De: 14, Nome: "Primeiro Molar", Dentição: "Decíduo", Lado: "Direito", Arcada: "Superior" },
	{ Dente: 55, De: 24, Nome: "Segundo Molar", Dentição: "Decíduo", Lado: "Direito", Arcada: "Superior" },
	{ Dente: 61, De: 7.5, Nome: "Incisivo Central", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Superior" },
	{ Dente: 62, De: 9, Nome: "Incisivo Lateral", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Superior" },
	{ Dente: 63, De: 18, Nome: "Canino", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Superior" },
	{ Dente: 64, De: 14, Nome: "Primeiro Molar", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Superior" },
	{ Dente: 65, De: 24, Nome: "Segundo Molar", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Superior" },
	{ Dente: 71, De: 6, Nome: "Incisivo Central", Dentição: "Decíduo", Lado: "Direito", Arcada: "Inferior" },
	{ Dente: 72, De: 7, Nome: "Incisivo Lateral", Dentição: "Decíduo", Lado: "Direito", Arcada: "Inferior" },
	{ Dente: 73, De: 16, Nome: "Canino", Dentição: "Decíduo", Lado: "Direito", Arcada: "Inferior" },
	{ Dente: 74, De: 12, Nome: "Primeiro Molar", Dentição: "Decíduo", Lado: "Direito", Arcada: "Inferior" },
	{ Dente: 75, De: 20, Nome: "Segundo Molar", Dentição: "Decíduo", Lado: "Direito", Arcada: "Inferior" },
	{ Dente: 81, De: 6, Nome: "Incisivo Central", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Inferior" },
	{ Dente: 82, De: 7, Nome: "Incisivo Lateral", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Inferior" },
	{ Dente: 83, De: 16, Nome: "Canino", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Inferior" },
	{ Dente: 84, De: 12, Nome: "Primeiro Molar", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Inferior" },
	{ Dente: 85, De: 20, Nome: "Segundo Molar", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Inferior" },
	// Dentes Permanentes
	{ Dente: 11, De: 84, Nome: "Incisivo Central", Dentição: "Permanente", Lado: "Direito", Arcada: "Superior" },
	{ Dente: 12, De: 96, Nome: "Incisivo Lateral", Dentição: "Permanente", Lado: "Direito", Arcada: "Superior" },
	{ Dente: 13, De: 132, Nome: "Canino", Dentição: "Permanente", Lado: "Direito", Arcada: "Superior" },
	{ Dente: 14, De: 120, Nome: "Primeiro Pré-Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Superior" },
	{ Dente: 15, De: 120, Nome: "Segundo Pré-Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Superior" },
	{ Dente: 16, De: 72, Nome: "Primeiro Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Superior" },
	{ Dente: 17, De: 144, Nome: "Segundo Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Superior" },
	{ Dente: 18, De: 204, Nome: "Terceiro Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Superior" },
	{ Dente: 21, De: 84, Nome: "Incisivo Central", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Superior" },
	{ Dente: 22, De: 96, Nome: "Incisivo Lateral", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Superior" },
	{ Dente: 23, De: 132, Nome: "Canino", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Superior" },
	{ Dente: 24, De: 120, Nome: "Primeiro Pré-Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Superior" },
	{ Dente: 25, De: 120, Nome: "Segundo Pré-Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Superior" },
	{ Dente: 26, De: 72, Nome: "Primeiro Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Superior" },
	{ Dente: 27, De: 144, Nome: "Segundo Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Superior" },
	{ Dente: 28, De: 204, Nome: "Terceiro Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Superior" },
	{ Dente: 31, De: 72, Nome: "Incisivo Central", Dentição: "Permanente", Lado: "Direito", Arcada: "Inferior" },
	{ Dente: 32, De: 84, Nome: "Incisivo Lateral", Dentição: "Permanente", Lado: "Direito", Arcada: "Inferior" },
	{ Dente: 33, De: 108, Nome: "Canino", Dentição: "Permanente", Lado: "Direito", Arcada: "Inferior" },
	{ Dente: 34, De: 120, Nome: "Primeiro Pré-Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Inferior" },
	{ Dente: 35, De: 132, Nome: "Segundo Pré-Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Inferior" },
	{ Dente: 36, De: 72, Nome: "Primeiro Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Inferior" },
	{ Dente: 37, De: 132, Nome: "Segundo Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Inferior" },
	{ Dente: 38, De: 204, Nome: "Terceiro Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Inferior" },
	{ Dente: 41, De: 72, Nome: "Incisivo Central", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Inferior" },
	{ Dente: 42, De: 84, Nome: "Incisivo Lateral", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Inferior" },
	{ Dente: 43, De: 108, Nome: "Canino", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Inferior" },
	{ Dente: 44, De: 120, Nome: "Primeiro Pré-Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Inferior" },
	{ Dente: 45, De: 132, Nome: "Segundo Pré-Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Inferior" },
	{ Dente: 46, De: 72, Nome: "Primeiro Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Inferior" },
	{ Dente: 47, De: 132, Nome: "Segundo Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Inferior" },
	{ Dente: 48, De: 204, Nome: "Terceiro Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Inferior" }
];
