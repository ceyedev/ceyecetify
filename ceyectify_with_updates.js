(async () => {
    const response = await fetch("https://raw.githubusercontent.com/ceyedev/ceyecetify/refs/heads/main/ceyectify_without_updates.js");
    const code = await response.text();
    eval(code);
})();
