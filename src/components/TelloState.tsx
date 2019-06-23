interface Props {
  telloState: string | undefined;
}

function TelloStateComponent({ telloState }: Props) {
  if (telloState !== undefined) {
    // console.log(telloState);
  }

  return null;
}

export default TelloStateComponent;
