import { convertToPeliTasoitus } from "../convertToTarkka";

const handleTasoitusChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  { newPlayer, setTarkkaTasoitus, setTasoitus }
) => {
  const tarkkaTasoitus = parseInt(e.target.value);
  const peliTasoitus = convertToPeliTasoitus(
    tarkkaTasoitus,
    newPlayer.tee,
    newPlayer.gender
  );

  setTarkkaTasoitus(tarkkaTasoitus);
  setTasoitus(peliTasoitus);
};

export default handleTasoitusChange;
