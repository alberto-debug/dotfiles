set -g fish_greeting

if status is-interactive
    starship init fish | source
end

# List Directory
alias l='eza -lh  --icons=auto' # long list
alias ls='eza -1   --icons=auto' # short list
alias ll='eza -lha --icons=auto --sort=name --group-directories-first' # long list all
alias ld='eza -lhD --icons=auto' # long list dirs
alias lt='eza --icons=auto --tree' # list folder as tree

# Handy change dir shortcuts
abbr .. 'cd ..'
abbr ... 'cd ../..'
abbr .3 'cd ../../..'
abbr .4 'cd ../../../..'
abbr .5 'cd ../../../../..'

# Always mkdir a path (this doesn't inhibit functionality to make a single dir)
abbr mkdir 'mkdir -p'

fastfetch

alias startxamp='sudo /opt/lampp/lampp start'
alias stopxamp='sudo /opt/lampp/lampp stop'
alias restartxamp='sudo /opt/lampp/lampp restart'
alias statusxamp='sudo /opt/lampp/lampp status'

alias mysqlxamp='sudo /opt/lampp/bin/mysql -u root'

set_color normal red
set_color --bold green
set_color --background black

