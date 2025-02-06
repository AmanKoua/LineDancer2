import "./SetUp.css"

export const SetUp = () => {

    return (
    <main>
        <section className="setup__section">
            <h1>
                Set up
            </h1>

            <fieldset className="section__fieldset">
                <div className="fieldset__inputcard">
                    <label>
                        Video (mp4)
                    </label>
                    <input type="file"></input>
                </div>


                <div className="fieldset__inputcard">
                    <label>
                        Audio (mp3)
                    </label>
                    <input type="file"></input>
                </div>
            </fieldset>
        </section>
    </main>
    )

}