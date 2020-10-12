require "jekyll"
require "toml-rb"

module Bookshop
  class ArrayStructures
    def self.get_story_name(path)
      basename = path.split("/").last.split(".").first
      return basename.split("-").map(&:capitalize).join(" ")
    end

    def self.transform_component(component, site)
      result = {}
      component.each_pair { |storyname, story|
        story.each_pair {|key, value|
          if result.has_key?(key) && storyname != "defaults"
            next
          end

          if key.include? "--repeat"
            new_key = key.split("--").first
            result[new_key] = []
            site.config["_array_structures"][new_key] ||= {
              "values" => []
            }

            label = new_key.split("_").map(&:capitalize).join(" ")
            if site.config["_array_structures"][new_key]["values"].select{|value| value.label == label}.length > 0
              next
            end
            site.config["_array_structures"][new_key]["values"].push({
              "label" => label,
              "value" => value
            })
          elsif key.include? "--select" or key.include? "--radio" or key.include? "--inline-radio"
            new_key = key.split("--").first
            result[new_key] = nil
            site.config["_select_data"][new_key+"s"] = []
            value.each_value{|option|
              if site.config["_select_data"][new_key+"s"].select{|value| value == option}.length > 0
                next
              end
              site.config["_select_data"][new_key+"s"].push(option)
            }
          elsif key.include? "--multi-select" or key.include? "--check" or key.include? "--inline-check"
            new_key = key.split("--").first
            result[new_key] = []
            site.config["_select_data"][new_key] = []
            value.each_value{|option|
              if site.config["_select_data"][new_key].select{|value| value == option}.length > 0
                next
              end
              site.config["_select_data"][new_key].push(option)
            } 
          else
            result[key] = value
          end
        }
      }
      return result
    end

    def self.build_array_structures(site)
      base_path = ""
      if !site.theme.nil?
        base_path = site.theme.root + "/_bookshop/components/"
      end
      site.config["_select_data"] ||= {}
      site.config["_array_structures"] ||= {}
      site.config["_array_structures"]["components"] ||= {
        "values" => []
      }
      Dir.glob("**/*.stories.{toml,tml,tom,tm}", base: base_path).each do |f|
        component = TomlRB.load_file(base_path + f)
        site.config["_array_structures"]["components"]["values"].push({
          "label" => get_story_name(f),
          "value" => transform_component(component, site)
        })
      end
    end
  end
end

Jekyll::Hooks.register :site, :after_init do |site|
  Bookshop::ArrayStructures.build_array_structures(site)
end 
