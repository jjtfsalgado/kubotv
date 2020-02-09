export const eventDispatcher = new class {
    private topics = {} as {[topic in EVENTS]: Set<any>};

    public subscribe(event: EVENTS, listener: (args: any) => void){
        if(!this.topics[event]){
            this.topics[event] = new Set<any>()
        }
        const topic = this.topics[event];
        topic.add(listener);

        console.info("added new listener");

        return {
            delete: () => {
                topic.delete(listener);
                console.warn("Deleting event listener", listener)
            }
        };
    }

    public publish(topic: EVENTS, args: any){
        const listeners = this.topics[topic];
        listeners.forEach(i => i(args))
    }
}();


export const enum EVENTS {
    PLAYLIST_UPDATE = "playlist_update",
    CHANNEL_UPDATE = "channel_update"
}