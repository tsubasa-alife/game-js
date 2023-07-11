const maybeRenderDuringTraining = async(cartPole) => {
    renderCartPole(cartPole);
    await tf.nextFrame();
}