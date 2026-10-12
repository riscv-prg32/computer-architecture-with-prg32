# 1. sign in to the Store and create a token on the Tokens page
# 2. keep it in the environment of your shell: never in a file, never in Git
export PRG32_STORE_URL="https://store.prg32.uniparthenope.it"
export PRG32_STORE_TOKEN="paste-your-token-here"

# 3. submit
python3 -m prg32 store publish-bundle ~/verm1/verm1-1.0.0.zip \
    --store-url "$PRG32_STORE_URL" --token "$PRG32_STORE_TOKEN"
