import {makeAutoObservable} from "mobx";

export const store = makeAutoObservable({
    markers: null,
    async getMarkerPosition() {
        try {
            const data = await fetch("http://muhasebe.dusunsoft.com/onmuhasebe/yonetim/api")
            const res = await data.json()

            if (this.markers && JSON.stringify(this.markers) !== JSON.stringify(res)) {
                this.setMarkers(res)
            }
            else if(!this.markers) this.setMarkers(res)

        }
        catch (e) {
            console.log(e)
        }
    },
    setMarkers(markers) {
        this.markers = markers
    },
})