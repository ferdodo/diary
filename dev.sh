#!/bin/bash
STATE=`mktemp -d`
touch $STATE/src
touch $STATE/build

function sync-containers {
    docker cp . diary-diary-1:/diary
}

function set-state {
	find . -type f -not -path '*/\.*' -printf "%T+\t%M\t%p\n" | md5sum > $STATE/$1
}

function diff-state {
	cmp -s $STATE/$1 $STATE/$2 || return 0
	return 1
}

function setup_pre_commit_hook {
	if [ -f ".git/hooks/pre-commit" ]; then
        return 0
    fi

	ls .git/hooks/pre-commit.sample
	echo "#!/bin/sh" > .git/hooks/pre-commit
	echo "docker compose down" >> .git/hooks/pre-commit
	echo "docker compose up -d --build" >> .git/hooks/pre-commit
	chmod +x .git/hooks/pre-commit
}

set -e
setup_pre_commit_hook
docker compose down -t 1
docker compose up -d --build diary
echo "╭───────────────────────────────╮"
echo "│ Diary: http://localhost:33052 │"
echo "╰───────────────────────────────╯"
set +e

while true
do 
	set-state src

	if diff-state src build; then
		set-state build && sync-containers
	fi

	sleep 1
done