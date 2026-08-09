run_web:
	export NODE_OPTIONS=--openssl-legacy-provider && npm run dev

update_core:
	cd uifd && go build -o aa ./update && ./aa && rm ./aa
