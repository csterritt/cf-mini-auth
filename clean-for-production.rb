#!/usr/bin/env ruby
def check_git_modified_files
#     res = `git diff --name-only | grep -E -v '(clean-for-production.rb|prod_deploy.sh)'`.split(/[\r\n]+/)
    res = `git diff --name-only`.split(/[\r\n]+/)
    if res.length > 0
        $stderr.puts "Error -- you have checked out files."
        $stderr.puts "All must be checked in before you can deploy."
        exit 1
    end
end

def copy_to_temp_cleaning(file_name, out_filename)
    File.open(out_filename, "w") do |out|
        state = :KEEP
        File.open(file_name, "r") do |inf|
            inf.each_line do |line|
            case line
                when /PRODUCTION:REMOVE\s*$/
                    next

                when /PRODUCTION:REMOVE-NEXT-LINE/
                    state = :SKIP
                    next

                when /PRODUCTION:UNCOMMENT/
                    if line =~ /^(\s*)\/\/(\s*\S.*)\/\/\s*PRODUCTION:UNCOMMENT\s*$/
                        out.puts "#{$1}#{$2}"
                    else
                        out.puts line
                    end
                else
                    out.puts line unless state == :SKIP
                    state = :KEEP
                end
            end
        end
    end
end

# ----
check_git_modified_files()

res = `/opt/homebrew/bin/rg -l PRODUCTION | grep -v clean-for-production.rb`
files = res.split(/[\r\n]+/)

files.each do |file_name|
    copy_to_temp_cleaning(file_name, "tmp_file")
    File.rename("tmp_file", file_name)
end
