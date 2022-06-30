use daachorse::charwise::CharwiseDoubleArrayAhoCorasick as DoubleArrayAhoCorasick;
use neon::prelude::*;

pub struct Instance {
    ac: Box<DoubleArrayAhoCorasick>,
    case_sensitive: bool,
}

impl Finalize for Instance {}

// createAhoCorasick(patterns: string[]): AhoCorasickBox
fn create_aho_corasick(mut cx: FunctionContext) -> JsResult<JsBox<Instance>> {
    let mut patterns = cx
        .argument::<JsArray>(0)?
        .to_vec(&mut cx)?
        .into_iter()
        .map(|v| {
            v.downcast::<JsString, _>(&mut cx)
                .or_throw(&mut cx)
                .map(|v| v.value(&mut cx))
        })
        .collect::<Result<Vec<_>, _>>()?;

    let options = cx.argument::<JsObject>(1)?;
    let case_sensitive = options
        .get::<JsBoolean, _, _>(&mut cx, "caseSensitive")?
        .value(&mut cx);

    if !case_sensitive {
        patterns = patterns.iter().map(|x| x.to_lowercase()).collect();
    }
    let ac = DoubleArrayAhoCorasick::new(patterns).unwrap();

    Ok(cx.boxed(Instance {
        ac: Box::new(ac),
        case_sensitive,
    }))
}

// isMatch(ac: AhoCorasickBox, text: string): boolean
fn is_match(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    let instance = &cx.argument::<JsBox<Instance>>(0)?;
    let ac = &instance.ac;
    let case_sensitive = instance.case_sensitive;

    let mut text = cx
        .argument::<JsString>(1)?
        .downcast::<JsString, _>(&mut cx)
        .or_throw(&mut cx)?
        .value(&mut cx);

    if !case_sensitive {
        text = text.to_lowercase();
    }

    let result: bool = ac.find_overlapping_iter(&text).next().is_some();

    Ok(cx.boolean(result))
}

// findAll(ac: AhoCorasickBox, text: string): string[]
fn find_all(mut cx: FunctionContext) -> JsResult<JsArray> {
    let instance = &cx.argument::<JsBox<Instance>>(0)?;
    let ac = &instance.ac;
    let case_sensitive = instance.case_sensitive;

    let text = cx
        .argument::<JsString>(1)?
        .downcast::<JsString, _>(&mut cx)
        .or_throw(&mut cx)?
        .value(&mut cx);

    let mut matches = vec![];
    if case_sensitive {
        for mat in ac.find_overlapping_iter(&text) {
            matches.push(&text[mat.start()..mat.end()]);
        }
    } else {
        for mat in ac.find_overlapping_iter(&text.to_lowercase()) {
            matches.push(&text[mat.start()..mat.end()]);
        }
    }
    matches.sort_unstable();
    matches.dedup();

    let js_array = JsArray::new(&mut cx, matches.len() as u32);
    matches.iter().enumerate().for_each(|(i, obj)| {
        let js_string = cx.string(obj);
        js_array.set(&mut cx, i as u32, js_string).unwrap();
    });

    Ok(js_array)
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("createAhoCorasick", create_aho_corasick)?;
    cx.export_function("isMatch", is_match)?;
    cx.export_function("findAll", find_all)?;
    Ok(())
}
