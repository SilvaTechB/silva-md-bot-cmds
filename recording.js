async function alwaysRecording(client, jid) {
    setInterval(async () => {
        await client.sendPresenceUpdate('recording', jid);
    }, 15000); // Every 15 seconds
}

module.exports = alwaysRecording;
