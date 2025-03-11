export interface Dente {
	Dente: number;
	Erupcao: number;
	Nome: string;
	Dentição: string;
	Lado: string;
	Arcada: string;
}

export const dentesTabela: Dente[] = [
	{ Dente: 51, Erupcao: 7.5, Nome: "Incisivo Central", Dentição: "Decíduo", Lado: "Direito", Arcada: "Superior" },
	{ Dente: 52, Erupcao: 9, Nome: "Incisivo Lateral", Dentição: "Decíduo", Lado: "Direito", Arcada: "Superior" },
	{ Dente: 53, Erupcao: 18, Nome: "Canino", Dentição: "Decíduo", Lado: "Direito", Arcada: "Superior" },
	{ Dente: 54, Erupcao: 14, Nome: "Primeiro Molar", Dentição: "Decíduo", Lado: "Direito", Arcada: "Superior" },
	{ Dente: 55, Erupcao: 24, Nome: "Segundo Molar", Dentição: "Decíduo", Lado: "Direito", Arcada: "Superior" },
	{ Dente: 61, Erupcao: 7.5, Nome: "Incisivo Central", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Superior" },
	{ Dente: 62, Erupcao: 9, Nome: "Incisivo Lateral", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Superior" },
	{ Dente: 63, Erupcao: 18, Nome: "Canino", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Superior" },
	{ Dente: 64, Erupcao: 14, Nome: "Primeiro Molar", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Superior" },
	{ Dente: 65, Erupcao: 24, Nome: "Segundo Molar", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Superior" },
	{ Dente: 71, Erupcao: 6, Nome: "Incisivo Central", Dentição: "Decíduo", Lado: "Direito", Arcada: "Inferior" },
	{ Dente: 72, Erupcao: 7, Nome: "Incisivo Lateral", Dentição: "Decíduo", Lado: "Direito", Arcada: "Inferior" },
	{ Dente: 73, Erupcao: 16, Nome: "Canino", Dentição: "Decíduo", Lado: "Direito", Arcada: "Inferior" },
	{ Dente: 74, Erupcao: 12, Nome: "Primeiro Molar", Dentição: "Decíduo", Lado: "Direito", Arcada: "Inferior" },
	{ Dente: 75, Erupcao: 20, Nome: "Segundo Molar", Dentição: "Decíduo", Lado: "Direito", Arcada: "Inferior" },
	{ Dente: 81, Erupcao: 6, Nome: "Incisivo Central", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Inferior" },
	{ Dente: 82, Erupcao: 7, Nome: "Incisivo Lateral", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Inferior" },
	{ Dente: 83, Erupcao: 16, Nome: "Canino", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Inferior" },
	{ Dente: 84, Erupcao: 12, Nome: "Primeiro Molar", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Inferior" },
	{ Dente: 85, Erupcao: 20, Nome: "Segundo Molar", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Inferior" },
	// Dentes Permanentes
	{ Dente: 11, Erupcao: 84, Nome: "Incisivo Central", Dentição: "Permanente", Lado: "Direito", Arcada: "Superior" },
	{ Dente: 12, Erupcao: 96, Nome: "Incisivo Lateral", Dentição: "Permanente", Lado: "Direito", Arcada: "Superior" },
	{ Dente: 13, Erupcao: 132, Nome: "Canino", Dentição: "Permanente", Lado: "Direito", Arcada: "Superior" },
	{ Dente: 14, Erupcao: 120, Nome: "Primeiro Pré-Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Superior" },
	{ Dente: 15, Erupcao: 120, Nome: "Segundo Pré-Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Superior" },
	{ Dente: 16, Erupcao: 72, Nome: "Primeiro Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Superior" },
	{ Dente: 17, Erupcao: 144, Nome: "Segundo Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Superior" },
	{ Dente: 18, Erupcao: 204, Nome: "Terceiro Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Superior" },
	{ Dente: 21, Erupcao: 84, Nome: "Incisivo Central", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Superior" },
	{ Dente: 22, Erupcao: 96, Nome: "Incisivo Lateral", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Superior" },
	{ Dente: 23, Erupcao: 132, Nome: "Canino", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Superior" },
	{ Dente: 24, Erupcao: 120, Nome: "Primeiro Pré-Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Superior" },
	{ Dente: 25, Erupcao: 120, Nome: "Segundo Pré-Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Superior" },
	{ Dente: 26, Erupcao: 72, Nome: "Primeiro Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Superior" },
	{ Dente: 27, Erupcao: 144, Nome: "Segundo Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Superior" },
	{ Dente: 28, Erupcao: 204, Nome: "Terceiro Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Superior" },
	{ Dente: 31, Erupcao: 72, Nome: "Incisivo Central", Dentição: "Permanente", Lado: "Direito", Arcada: "Inferior" },
	{ Dente: 32, Erupcao: 84, Nome: "Incisivo Lateral", Dentição: "Permanente", Lado: "Direito", Arcada: "Inferior" },
	{ Dente: 33, Erupcao: 108, Nome: "Canino", Dentição: "Permanente", Lado: "Direito", Arcada: "Inferior" },
	{ Dente: 34, Erupcao: 120, Nome: "Primeiro Pré-Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Inferior" },
	{ Dente: 35, Erupcao: 132, Nome: "Segundo Pré-Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Inferior" },
	{ Dente: 36, Erupcao: 72, Nome: "Primeiro Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Inferior" },
	{ Dente: 37, Erupcao: 132, Nome: "Segundo Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Inferior" },
	{ Dente: 38, Erupcao: 204, Nome: "Terceiro Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Inferior" },
	{ Dente: 41, Erupcao: 72, Nome: "Incisivo Central", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Inferior" },
	{ Dente: 42, Erupcao: 84, Nome: "Incisivo Lateral", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Inferior" },
	{ Dente: 43, Erupcao: 108, Nome: "Canino", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Inferior" },
	{ Dente: 44, Erupcao: 120, Nome: "Primeiro Pré-Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Inferior" },
	{ Dente: 45, Erupcao: 132, Nome: "Segundo Pré-Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Inferior" },
	{ Dente: 46, Erupcao: 72, Nome: "Primeiro Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Inferior" },
	{ Dente: 47, Erupcao: 132, Nome: "Segundo Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Inferior" },
	{ Dente: 48, Erupcao: 204, Nome: "Terceiro Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Inferior" }
];

export const dentesTabelaHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      color: #2A7AC3;
    }
    h3 {
      text-align: center;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-top: 20px;
    }
    th, td {
      border: 1px solid #ccc;
      padding: 8px 12px;
      text-align: left;
    }
    th {
      background-color: #f5f5f5;
    }
  </style>
</head>
<body>
  <h3>Tabela de Referência de Erupções Dentárias</h3>
  <table>
    <thead>
      <tr>
        <th>Dente</th>
        <th>Dentição</th>
        <th>Nome</th>
        <th>Lado</th>
        <th>Arcada</th>
        <th>Erupção (meses)</th>
      </tr>
    </thead>
    <tbody>
      <!-- Dentes Decíduos -->
      <tr>
        <td>51</td>
        <td>Decíduo</td>
        <td>Incisivo Central</td>
        <td>Direito</td>
        <td>Superior</td>
        <td>7.5</td>
      </tr>
      <tr>
        <td>52</td>
        <td>Decíduo</td>
        <td>Incisivo Lateral</td>
        <td>Direito</td>
        <td>Superior</td>
        <td>9</td>
      </tr>
      <tr>
        <td>53</td>
        <td>Decíduo</td>
        <td>Canino</td>
        <td>Direito</td>
        <td>Superior</td>
        <td>18</td>
      </tr>
      <tr>
        <td>54</td>
        <td>Decíduo</td>
        <td>Primeiro Molar</td>
        <td>Direito</td>
        <td>Superior</td>
        <td>14</td>
      </tr>
      <tr>
        <td>55</td>
        <td>Decíduo</td>
        <td>Segundo Molar</td>
        <td>Direito</td>
        <td>Superior</td>
        <td>24</td>
      </tr>
      <tr>
        <td>61</td>
        <td>Decíduo</td>
        <td>Incisivo Central</td>
        <td>Esquerdo</td>
        <td>Superior</td>
        <td>7.5</td>
      </tr>
      <tr>
        <td>62</td>
        <td>Decíduo</td>
        <td>Incisivo Lateral</td>
        <td>Esquerdo</td>
        <td>Superior</td>
        <td>9</td>
      </tr>
      <tr>
        <td>63</td>
        <td>Decíduo</td>
        <td>Canino</td>
        <td>Esquerdo</td>
        <td>Superior</td>
        <td>18</td>
      </tr>
      <tr>
        <td>64</td>
        <td>Decíduo</td>
        <td>Primeiro Molar</td>
        <td>Esquerdo</td>
        <td>Superior</td>
        <td>14</td>
      </tr>
      <tr>
        <td>65</td>
        <td>Decíduo</td>
        <td>Segundo Molar</td>
        <td>Esquerdo</td>
        <td>Superior</td>
        <td>24</td>
      </tr>
      <tr>
        <td>71</td>
        <td>Decíduo</td>
        <td>Incisivo Central</td>
        <td>Direito</td>
        <td>Inferior</td>
        <td>6</td>
      </tr>
      <tr>
        <td>72</td>
        <td>Decíduo</td>
        <td>Incisivo Lateral</td>
        <td>Direito</td>
        <td>Inferior</td>
        <td>7</td>
      </tr>
      <tr>
        <td>73</td>
        <td>Decíduo</td>
        <td>Canino</td>
        <td>Direito</td>
        <td>Inferior</td>
        <td>16</td>
      </tr>
      <tr>
        <td>74</td>
        <td>Decíduo</td>
        <td>Primeiro Molar</td>
        <td>Direito</td>
        <td>Inferior</td>
        <td>12</td>
      </tr>
      <tr>
        <td>75</td>
        <td>Decíduo</td>
        <td>Segundo Molar</td>
        <td>Direito</td>
        <td>Inferior</td>
        <td>20</td>
      </tr>
      <tr>
        <td>81</td>
        <td>Decíduo</td>
        <td>Incisivo Central</td>
        <td>Esquerdo</td>
        <td>Inferior</td>
        <td>6</td>
      </tr>
      <tr>
        <td>82</td>
        <td>Decíduo</td>
        <td>Incisivo Lateral</td>
        <td>Esquerdo</td>
        <td>Inferior</td>
        <td>7</td>
      </tr>
      <tr>
        <td>83</td>
        <td>Decíduo</td>
        <td>Canino</td>
        <td>Esquerdo</td>
        <td>Inferior</td>
        <td>16</td>
      </tr>
      <tr>
        <td>84</td>
        <td>Decíduo</td>
        <td>Primeiro Molar</td>
        <td>Esquerdo</td>
        <td>Inferior</td>
        <td>12</td>
      </tr>
      <tr>
        <td>85</td>
        <td>Decíduo</td>
        <td>Segundo Molar</td>
        <td>Esquerdo</td>
        <td>Inferior</td>
        <td>20</td>
      </tr>

      <!-- Dentes Permanentes -->
      <tr>
        <td>11</td>
        <td>Permanente</td>
        <td>Incisivo Central</td>
        <td>Direito</td>
        <td>Superior</td>
        <td>84</td>
      </tr>
      <tr>
        <td>12</td>
        <td>Permanente</td>
        <td>Incisivo Lateral</td>
        <td>Direito</td>
        <td>Superior</td>
        <td>96</td>
      </tr>
      <tr>
        <td>13</td>
        <td>Permanente</td>
        <td>Canino</td>
        <td>Direito</td>
        <td>Superior</td>
        <td>132</td>
      </tr>
      <tr>
        <td>14</td>
        <td>Permanente</td>
        <td>Primeiro Pré-Molar</td>
        <td>Direito</td>
        <td>Superior</td>
        <td>120</td>
      </tr>
      <tr>
        <td>15</td>
        <td>Permanente</td>
        <td>Segundo Pré-Molar</td>
        <td>Direito</td>
        <td>Superior</td>
        <td>120</td>
      </tr>
      <tr>
        <td>16</td>
        <td>Permanente</td>
        <td>Primeiro Molar</td>
        <td>Direito</td>
        <td>Superior</td>
        <td>72</td>
      </tr>
      <tr>
        <td>17</td>
        <td>Permanente</td>
        <td>Segundo Molar</td>
        <td>Direito</td>
        <td>Superior</td>
        <td>144</td>
      </tr>
      <tr>
        <td>18</td>
        <td>Permanente</td>
        <td>Terceiro Molar</td>
        <td>Direito</td>
        <td>Superior</td>
        <td>204</td>
      </tr>
      <tr>
        <td>21</td>
        <td>Permanente</td>
        <td>Incisivo Central</td>
        <td>Esquerdo</td>
        <td>Superior</td>
        <td>84</td>
      </tr>
      <tr>
        <td>22</td>
        <td>Permanente</td>
        <td>Incisivo Lateral</td>
        <td>Esquerdo</td>
        <td>Superior</td>
        <td>96</td>
      </tr>
      <tr>
        <td>23</td>
        <td>Permanente</td>
        <td>Canino</td>
        <td>Esquerdo</td>
        <td>Superior</td>
        <td>132</td>
      </tr>
      <tr>
        <td>24</td>
        <td>Permanente</td>
        <td>Primeiro Pré-Molar</td>
        <td>Esquerdo</td>
        <td>Superior</td>
        <td>120</td>
      </tr>
      <tr>
        <td>25</td>
        <td>Permanente</td>
        <td>Segundo Pré-Molar</td>
        <td>Esquerdo</td>
        <td>Superior</td>
        <td>120</td>
      </tr>
      <tr>
        <td>26</td>
        <td>Permanente</td>
        <td>Primeiro Molar</td>
        <td>Esquerdo</td>
        <td>Superior</td>
        <td>72</td>
      </tr>
      <tr>
        <td>27</td>
        <td>Permanente</td>
        <td>Segundo Molar</td>
        <td>Esquerdo</td>
        <td>Superior</td>
        <td>144</td>
      </tr>
      <tr>
        <td>28</td>
        <td>Permanente</td>
        <td>Terceiro Molar</td>
        <td>Esquerdo</td>
        <td>Superior</td>
        <td>204</td>
      </tr>
      <tr>
        <td>31</td>
        <td>Permanente</td>
        <td>Incisivo Central</td>
        <td>Direito</td>
        <td>Inferior</td>
        <td>72</td>
      </tr>
      <tr>
        <td>32</td>
        <td>Permanente</td>
        <td>Incisivo Lateral</td>
        <td>Direito</td>
        <td>Inferior</td>
        <td>84</td>
      </tr>
      <tr>
        <td>33</td>
        <td>Permanente</td>
        <td>Canino</td>
        <td>Direito</td>
        <td>Inferior</td>
        <td>108</td>
      </tr>
      <tr>
        <td>34</td>
        <td>Permanente</td>
        <td>Primeiro Pré-Molar</td>
        <td>Direito</td>
        <td>Inferior</td>
        <td>120</td>
      </tr>
      <tr>
        <td>35</td>
        <td>Permanente</td>
        <td>Segundo Pré-Molar</td>
        <td>Direito</td>
        <td>Inferior</td>
        <td>132</td>
      </tr>
      <tr>
        <td>36</td>
        <td>Permanente</td>
        <td>Primeiro Molar</td>
        <td>Direito</td>
        <td>Inferior</td>
        <td>72</td>
      </tr>
      <tr>
        <td>37</td>
        <td>Permanente</td>
        <td>Segundo Molar</td>
        <td>Direito</td>
        <td>Inferior</td>
        <td>132</td>
      </tr>
      <tr>
        <td>38</td>
        <td>Permanente</td>
        <td>Terceiro Molar</td>
        <td>Direito</td>
        <td>Inferior</td>
        <td>204</td>
      </tr>
      <tr>
        <td>41</td>
        <td>Permanente</td>
        <td>Incisivo Central</td>
        <td>Esquerdo</td>
        <td>Inferior</td>
        <td>72</td>
      </tr>
      <tr>
        <td>42</td>
        <td>Permanente</td>
        <td>Incisivo Lateral</td>
        <td>Esquerdo</td>
        <td>Inferior</td>
        <td>84</td>
      </tr>
      <tr>
        <td>43</td>
        <td>Permanente</td>
        <td>Canino</td>
        <td>Esquerdo</td>
        <td>Inferior</td>
        <td>108</td>
      </tr>
      <tr>
        <td>44</td>
        <td>Permanente</td>
        <td>Primeiro Pré-Molar</td>
        <td>Esquerdo</td>
        <td>Inferior</td>
        <td>120</td>
      </tr>
      <tr>
        <td>45</td>
        <td>Permanente</td>
        <td>Segundo Pré-Molar</td>
        <td>Esquerdo</td>
        <td>Inferior</td>
        <td>132</td>
      </tr>
      <tr>
        <td>46</td>
        <td>Permanente</td>
        <td>Primeiro Molar</td>
        <td>Esquerdo</td>
        <td>Inferior</td>
        <td>72</td>
      </tr>
      <tr>
        <td>47</td>
        <td>Permanente</td>
        <td>Segundo Molar</td>
        <td>Esquerdo</td>
        <td>Inferior</td>
        <td>132</td>
      </tr>
      <tr>
        <td>48</td>
        <td>Permanente</td>
        <td>Terceiro Molar</td>
        <td>Esquerdo</td>
        <td>Inferior</td>
        <td>204</td>
      </tr>
    </tbody>
  </table>
</body>
</html>

`;